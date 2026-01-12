from zenml import step
from imblearn.over_sampling import ADASYN
from sklearn.model_selection import train_test_split
import pandas as pd
from typing import Tuple
@step
def preprocess(df)-> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    X = df.drop(columns=["Churn","SeniorCitizen"])
    y = df["Churn"]

    adasyn = ADASYN(random_state=42)
    X_ad, y_ad = adasyn.fit_resample(X, y)

    X_train, X_test, y_train, y_test = train_test_split(
        X_ad, y_ad, test_size=0.1, random_state=42
    )

    return X_train, X_test, y_train, y_test
