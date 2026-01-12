from zenml import step
import pandas as pd
import yaml
from typing import Tuple
@step
def load_data()-> Tuple[pd.DataFrame, str]:
    df = pd.read_csv("D:/churn-prediction/churn-prediction/flask_prediction_churn/Data4_modified.csv")

    with open("D:/churn-prediction/churn-prediction/flask_prediction_churn/Data4_modified.csv.dvc", "r") as f:
        dvc_meta = yaml.safe_load(f)

    dataset_hash = dvc_meta['outs'][0]['md5']

    return df, dataset_hash
