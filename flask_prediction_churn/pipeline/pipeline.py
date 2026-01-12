from zenml import pipeline
from steps.load_data_step import load_data
from steps.preprocess_step import preprocess
from steps.train_step import train_model_step
from steps.evaluate_step import evaluate
from steps.save_model_step import save_model

@pipeline
def churn_training_pipeline():
    df, dataset_hash = load_data()
    X_train, X_test, y_train, y_test = preprocess(df)
    model,run_id = train_model_step(X_train, y_train,dataset_hash,220,10)
    evaluate(model, X_test, y_test, dataset_hash,run_id)
    save_model(model)
