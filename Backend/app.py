from flask import Flask, render_template, request
import torch
import joblib
from transformers import BertTokenizer, BertForSequenceClassification

# Initialize the Flask app
app = Flask(__name__)

# Specify the directory where the model, tokenizer, and label encoder are saved
save_dir = '/Users/hardikchhipa/Desktop/Data_Manipulations_Projects/Dakshaab/saved_model'

# Load the saved model, tokenizer, and label encoder
model = BertForSequenceClassification.from_pretrained(save_dir)
tokenizer = BertTokenizer.from_pretrained(save_dir)
label_encoder = joblib.load(f'{save_dir}/label_encoder.pkl')

# Function to predict doctor type based on input comments
def predict_doctor_type(comments):
    encodings = tokenizer(comments, truncation=True, padding=True, max_length=512, return_tensors='pt')
    
    model.eval()
    with torch.no_grad():
        outputs = model(**encodings)
        predictions = torch.argmax(outputs.logits, dim=-1)
    
    predicted_labels = label_encoder.inverse_transform(predictions.cpu().numpy())
    return predicted_labels

# Route for the home page
@app.route('/')
def home():
    return render_template('home.html')


@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Get the comment(s) input from the user
        user_comments = request.form.getlist('comment')
        
        # Predict doctor types for the comments
        predicted_doctor_types = predict_doctor_type(user_comments)
        
        # Return the result back to the webpage, passing zip to the template
        return render_template('result.html', comments=user_comments, predictions=predicted_doctor_types, zip=zip)


if __name__ == '__main__':
    app.run(debug=True)
