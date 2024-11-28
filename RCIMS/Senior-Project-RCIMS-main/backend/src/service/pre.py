
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_curve, auc
from imblearn.over_sampling import SMOTE
from catboost import CatBoostClassifier
import matplotlib.pyplot as plt
import seaborn as sns

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
    depth=4,  # Reduced depth to prevent overfitting
    l2_leaf_reg=10,  # Higher regularization
    eval_metric='Accuracy',
    random_seed=42,
    verbose=100
)

catboost_smote.fit(X_train_smote, y_train_smote, eval_set=(X_test, y_test), early_stopping_rounds=50)

# Make predictions
y_pred_smote = catboost_smote.predict(X_test)

# Evaluate the model
accuracy_smote = accuracy_score(y_test, y_pred_smote)
conf_matrix_smote = confusion_matrix(y_test, y_pred_smote)
class_report_smote = classification_report(y_test, y_pred_smote)

print("CatBoost with SMOTE Confusion Matrix:\n", conf_matrix_smote)
print("CatBoost with SMOTE Classification Report:\n", class_report_smote)
print(f"CatBoost with SMOTE Accuracy: {accuracy_smote:.2f}")

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(conf_matrix_smote, annot=True, fmt='d', cmap='Blues', xticklabels=['No Relapse', 'Relapse'], yticklabels=['No Relapse', 'Relapse'])
plt.title('CatBoost with SMOTE Confusion Matrix')
plt.show()

# ROC Curve
fpr_smote, tpr_smote, thresholds_smote = roc_curve(y_test, catboost_smote.predict_proba(X_test)[:, 1])
roc_auc_smote = auc(fpr_smote, tpr_smote)

plt.figure(figsize=(8, 6))
plt.plot(fpr_smote, tpr_smote, color='blue', label='ROC curve (area = {:.2f})'.format(roc_auc_smote))
plt.plot([0, 1], [0, 1], color='red', linestyle='--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('CatBoost with SMOTE ROC Curve')
plt.legend(loc='lower right')
plt.show()