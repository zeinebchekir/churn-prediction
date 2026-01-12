from zenml import step
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix,
    classification_report, precision_recall_curve, roc_curve
)
import matplotlib.pyplot as plt
import seaborn as sns
import mlflow

@step
def evaluate(model, X_test, y_test, dataset_hash:str,run_id:str):

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:,1]
    mlflow.set_tracking_uri("http://localhost:5001")
    mlflow.set_experiment("churn_random_forest")

    with mlflow.start_run(run_id=run_id):
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_proba)

        mlflow.log_metric("accuracy", acc)
        mlflow.log_metric("precision", prec)
        mlflow.log_metric("recall", rec)
        mlflow.log_metric("f1", f1)
        mlflow.log_metric("roc_auc", roc_auc)
        mlflow.log_param("dataset_hash", dataset_hash)

        cm = confusion_matrix(y_test, y_pred)
        sns.heatmap(cm, annot=True, fmt="d")
        plt.savefig("confusion_matrix.png")
        mlflow.log_artifact("confusion_matrix.png")

        report = classification_report(y_test, y_pred)
        with open("classification_report.txt", "w") as f:
            f.write(report)
        mlflow.log_artifact("classification_report.txt")
