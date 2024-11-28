import pandas as pd

from sklearn.model_selection import train_test_split

from imblearn.over_sampling import SMOTE

from catboost import CatBoostClassifier

import numpy as np

import json

import sys



# Load and prepare the data

data = pd.read_csv('encoded_data.csv')  # Ensure the file path is correct

X = data.drop('Relapse Status', axis=1)

y = data['Relapse Status']



# Split the data

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)



# Apply SMOTE for oversampling the minority class

smote = SMOTE(random_state=42)

X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)



# Train CatBoost with SMOTE data

catboost_smote = CatBoostClassifier(

    iterations=1000,

    learning_rate=0.05,

    depth=4,

    l2_leaf_reg=10,

    eval_metric='Accuracy',

    random_seed=42,

    verbose=0

)



catboost_smote.fit(X_train_smote, y_train_smote, eval_set=(X_test, y_test), early_stopping_rounds=50)



# Function to convert JSON data to DataFrame

def json_to_dataframe(json_data):

    """

    Converts JSON data to a pandas DataFrame.

    

    Parameters:

    json_data (str or dict): The JSON data as a string or dictionary.

    

    Returns:

    pd.DataFrame: The converted DataFrame.

    """

    if isinstance(json_data, str):

        json_data = json.loads(json_data)

    

    # Wrap the dictionary in a list to create a DataFrame with a single row

    if isinstance(json_data, dict):

        json_data = [json_data]

    

    return pd.DataFrame(json_data)



def predict_new_data_from_json(json_data):

    """

    Predicts the class probabilities for new data using the trained CatBoost model.

    

    Parameters:

    json_data (str or dict): The JSON data for which predictions are to be made.

    

    Returns:

    np.ndarray: The predicted class probabilities for the new data.

    """
    
    new_data = json_to_dataframe(json_data)

    probabilities = catboost_smote.predict_proba(new_data)

    predictions = catboost_smote.predict(new_data)

    return probabilities * 100, predictions  # Convert probabilities to percentage



if __name__ == "__main__":

    # Check if JSON data is provided as a command-line argument

    if len(sys.argv) > 1:

        json_data = sys.argv[1]

        probabilities, predictions = predict_new_data_from_json(json_data)

        

        # Prepare the results as a JSON string

        results = {

            "probabilities": probabilities.tolist(),

            "predictions": predictions.tolist()

        }

        

        # Print the results as a JSON string

        print(json.dumps(results))

    else:

        print(json.dumps({"error": "No input data provided"}))


