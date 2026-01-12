from zenml import step
import pickle
import mlflow

@step
def save_model(model):
    pickle.dump(model, open("model.pkl","wb"))
    mlflow.sklearn.log_model(model, artifact_path="model")
