from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import json
from flask_cors import CORS

# Load the model and columns
model_path = "banglore_home_prices_model.pickle"
with open(model_path, 'rb') as f:#server\banglore_home_prices_model.pickle
    lr_clf = pickle.load(f)

with open('columns.json', 'r') as f:
    data_columns = json.load(f)['data_columns']
    

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app) 
# CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})



@app.route('/')
def home():
    return render_template('index.html', locations=data_columns)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    location = data['location']
    location = location
    sqft = float(data['sqft'])
    bath = float(data['bath'])
    bhk = float(data['bhk'])

    loc_index = np.where(np.array(data_columns) == location)[0][0]

    x = np.zeros(len(data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    prediction = lr_clf.predict([x])[0]
    
    pre = jsonify(prediction)
    pre.headers.add("Access-Control-Allow-Origin", "*")
    pre.headers.add("Content-Type", "application/json")

    return pre

@app.route('/locations')
def get_locations():
    response =jsonify(data_columns)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(debug=True)

