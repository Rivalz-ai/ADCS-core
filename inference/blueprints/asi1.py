import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import requests
import json
import re

# Load environment variables
load_dotenv()

ASI1_API_KEY = os.getenv("ASI1_API_KEY")
asi1_bp = Blueprint('asi1', __name__)

def analyze_with_asi1(content, format):
    try:
        # Prepare the request payload
        prompt = f"""You are an AI assistant that analyzes content and returns structured decisions.
                Instructions:
                1. Analyze the provided content
                2. Return your response in EXACTLY the format: {format}
                3. Do not add any additional text, explanation, or markdown formatting
                4. Your response must be parseable as a valid JSON array

                Content: {content}

                Format: {format}
                Make sure your response is ONLY a valid JSON array like: [value1, value2]"""
        
        headers = {
            "Authorization": f"Bearer {ASI1_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "asi1-mini",  # Or "asi1-base" / "asi1-128k" depending on your plan
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,  # Lower temperature for more consistent formatting
            "stream": False,
            "max_tokens": 1024
        }

        response = requests.post("https://api.asi1.ai/v1/chat/completions", headers=headers, json=payload)
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error in analyze_with_asi1: {str(e)}")
        return str(e)

@asi1_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    print(f"Received data: {data}")

    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400

    content = data['content']
    format = data.get('format', '["decision"]')  # Default format if not provided

    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400

    # Analyze content with ASI1
    analysis = analyze_with_asi1(content, format)
    print(f"Raw analysis result: {analysis}")

    try:
        # Clean the response to handle various formatting issues
        # Remove any markdown code block markers
        cleaned_analysis = re.sub(r'```json|```|\n', '', analysis)
        # Remove any outer quotes if present
        cleaned_analysis = cleaned_analysis.strip('"\'')
        
        # Try to parse the JSON
        parsed_analysis = json.loads(cleaned_analysis)
        
        return jsonify({
            'result': parsed_analysis,
            'status': 'success'
        }), 200
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        return jsonify({
            'result': None,
            'status': 'error',
            'message': 'Failed to parse response as JSON array',
            'raw_response': analysis
        }), 200