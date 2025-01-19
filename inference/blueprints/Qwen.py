import os
from flask import Blueprint, request, jsonify
import requests

# Define the blueprint
qwen_bp = Blueprint('qwen', __name__)

# Define the LLM endpoint and API details
BASE_URL = "https://nos-dep-2.node.k8s.prd.nos.ci/rivalz/v1/chat/completions"
# API_KEY = "YOUR_API_KEY"

# Headers for the API
headers = {
    "Content-Type": "application/json",
    # "Authorization": f"Bearer {API_KEY}"  # Add the API key if required
}

def query_custom_llm(model, content):
    """Query the custom LLM endpoint with the provided content."""
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": content}]
    }

    try:
        response = requests.post(BASE_URL, headers=headers, json=payload)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()  # Return the API's JSON response
    except requests.exceptions.RequestException as e:
        print(f"Error querying LLM: {e}")
        return None

@qwen_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'content' not in data or 'model' not in data:
        return jsonify({'error': 'Both "content" and "model" fields are required.'}), 400

    content = data['content']
    model = data['model']

    # Query the custom LLM API
    response = query_custom_llm(model, content)
    if response:
        return jsonify({'response': response}), 200
    else:
        return jsonify({'error': 'Failed to get a response from the LLM API.'}), 500
