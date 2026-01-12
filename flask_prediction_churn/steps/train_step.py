from zenml import step
from zenml.client import Client
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from datetime import datetime
from typing import Tuple
@step
def train_model_step(X_train, y_train,dataset_hash,
                     n_estimators:int=200, max_depth:int=15) -> Tuple[RandomForestClassifier, str]:
     
    # récupérer tracker MLflow configuré dans ZenML
    exp_tracker = Client().active_stack.experiment_tracker
    timestamp = datetime.now().strftime("%Y%m%d-%H%M")
    run_name = f"ne{n_estimators}_md{max_depth}_ds{dataset_hash}_{timestamp}"
    mlflow.set_experiment("churn_random_forest")  # nom de ton expérience
    mlflow.set_tracking_uri("http://localhost:5001")
    with mlflow.start_run(run_name=run_name)as run:

        # ⭐⭐ LOG PARAMETERS
        mlflow.log_params({
            "model": "RandomForest",
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "test_size": 0.2,
            "dataset_hash": dataset_hash
        })

        # entraînement
        model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            random_state=42
        )
        model.fit(X_train, y_train)

        # ⭐⭐ LOG MODEL
        mlflow.sklearn.log_model(model, "model")

        return model, run.info.run_id
