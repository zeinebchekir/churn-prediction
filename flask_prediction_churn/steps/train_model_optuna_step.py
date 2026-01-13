from zenml import step
import optuna
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score
from sklearn.model_selection import cross_val_score
from typing import Tuple

@step
def train_with_optuna_step(X_train, y_train, dataset_hash: str)->Tuple[RandomForestClassifier, str]:

    mlflow.set_tracking_uri("http://localhost:5001")
    mlflow.set_experiment("churn_optuna_optimization")

    def objective(trial):

        # 🔍 Optuna propose des valeurs
        n_estimators = trial.suggest_int("n_estimators", 50, 400)
        max_depth = trial.suggest_int("max_depth", 3, 25)
        min_samples_split = trial.suggest_float("min_samples_split", 0.1, 1.0)

        model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            random_state=42
        )

        # ⭐ validation croisée
        score = cross_val_score(model, X_train, y_train, cv=3, scoring="f1").mean()

        return score

    # 🎯 lancer l’optimisation
    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=30)   # <- tu peux augmenter

    best_params = study.best_params

    # 🏆 entraîner modèle final avec meilleurs params
   
    run_name = f"ne{best_params}_ds{dataset_hash}_optuna"

    # 📝 log Optuna + model vers MLflow
    with mlflow.start_run(run_name=run_name)as run:
        best_model = RandomForestClassifier(
        **best_params,
        random_state=42
          )
        best_model.fit(X_train, y_train)
        mlflow.log_params(best_params)
        mlflow.log_param("dataset_hash", dataset_hash)
        mlflow.sklearn.log_model(best_model, "best_optuna_model")

        mlflow.log_metric("best_score", study.best_value)

    return best_model, run.info.run_id
