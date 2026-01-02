import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix,precision_score,recall_score,f1_score,roc_auc_score,precision_recall_curve,roc_curve
from imblearn.over_sampling import ADASYN
import pickle
import mlflow
import subprocess
import matplotlib.pyplot as plt
from datetime import datetime
import argparse
import yaml

mlflow.set_tracking_uri("http://localhost:5001")
mlflow.set_experiment("churn_random_forest")
df=pd.read_csv('Data4_modified.csv')

def parse_args():
    parser = argparse.ArgumentParser(description="Train churn model with MLflow")

    parser.add_argument("--n_estimators", type=int, default=200)
    parser.add_argument("--max_depth", type=int, default=15)
    parser.add_argument("--sampler", type=str, default="ADASYN")
    parser.add_argument("--test_size", type=float, default=0.2)
    parser.add_argument("--run_name", type=str, default="auto")

    return parser.parse_args()

args = parse_args()

n_estimators = args.n_estimators
max_depth = args.max_depth
sampler = args.sampler
test_size = args.test_size

with open("Data4_modified.csv.dvc", "r") as f:
    dvc_meta = yaml.safe_load(f)

# Le hash est dans dvc_meta['outs'][0]['hash']
dvc_hash = dvc_meta['outs'][0]['hash']
print("DVC hash:", dvc_hash)


# import matplotlib.pyplot as plt
X=df.drop(columns=["Churn","SeniorCitizen"])
y=df["Churn"]
adasyn = ADASYN(random_state=42)
X_ad, y_ad = adasyn.fit_resample(X, y)

# Assuming X_ad and y_ad are already defined from the previous code
X_train, X_test, y_train, y_test = train_test_split(X_ad, y_ad, test_size=0.2, random_state=42)

if args.run_name == "auto":
    timestamp = datetime.now().strftime("%Y%m%d-%H%M")
    run_name = f"RF_{sampler}_ne{n_estimators}_md{max_depth}_ds{dvc_hash}_{timestamp}"
else: 
    run_name = args.run_name
with mlflow.start_run(run_name=run_name):
    mlflow.log_params({
        "model": "RandomForest",
        "n_estimators": n_estimators,
        "max_depth": max_depth,
        "sampler": sampler,
        "test_size": test_size,
        "dataset_hash": dvc_hash
    })
    mlflow.log_param("dataset_hash", dvc_hash)
# Initialize and train the Random Forest Classifier
    rf_model = RandomForestClassifier(n_estimators=n_estimators,max_depth=max_depth, random_state=42)  # You can adjust n_estimators
    rf_model.fit(X_train, y_train)

    # # Make predictions on the test set
    y_pred_rf = rf_model.predict(X_test)

    # # Evaluate the model
    accuracy_rf = accuracy_score(y_test, y_pred_rf)
    mlflow.log_metric("Accuracy", accuracy_rf)
    precision = precision_score(y_test, y_pred_rf)
    mlflow.log_metric("precision", precision)
    recall = recall_score(y_test, y_pred_rf)
    mlflow.log_metric("recall", recall)
    f1 = f1_score(y_test, y_pred_rf)
    mlflow.log_metric("f1_score", f1)  
    y_proba = rf_model.predict_proba(X_test)[:,1]
    roc_auc = roc_auc_score(y_test, y_proba)
    mlflow.log_metric("roc_auc", roc_auc)



    cm = confusion_matrix(y_test, y_pred_rf)
    plt.figure(figsize=(5,4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig("confusion_matrix.png")
    mlflow.log_artifact("confusion_matrix.png", artifact_path="plots")
    plt.close()

    # 🔹 Classification report (artefact texte)
    report = classification_report(y_test, y_pred_rf)
    with open("classification_report.txt", "w") as f:
        f.write(report)
    mlflow.log_artifact("classification_report.txt", artifact_path="reports")

    p, r, _ = precision_recall_curve(y_test, y_proba)
    plt.plot(r, p)
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall Curve")
    plt.savefig("pr_curve.png")
    mlflow.log_artifact("pr_curve.png", artifact_path="plots")
    plt.close()

    fpr, tpr, _ = roc_curve(y_test, y_proba)
    plt.plot(fpr, tpr)
    plt.xlabel("FPR")
    plt.ylabel("TPR")
    plt.title("ROC Curve")
    plt.savefig("roc_curve.png")
    mlflow.log_artifact("roc_curve.png", artifact_path="plots")
    plt.close()
     # 🔹 Modèle
    mlflow.sklearn.log_model(
        rf_model,
        artifact_path="model",
        registered_model_name="ChurnRandomForest"
    )
    mlflow.log_artifact("Data4_modified.csv", artifact_path="dataset")

    pickle.dump(rf_model,open("model.pkl","wb"))
