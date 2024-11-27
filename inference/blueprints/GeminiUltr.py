import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

geminiultr_bp = Blueprint('geminiultr', __name__)

def analyze_with_geminiultr(content, format):
    try:

        # Initialize Gemini-Ultra model
        model = genai.GenerativeModel('gemini-ultra')
        
        # Create prompt
        prompt = f"""You are an AI assistant that do whatever in the content provided.
        
        Instructions:
        1. Do whatever in the content provided
        2. get the desired return format in the content provided
        3. return with exact format
        
        Content: {content}
        Return format: {format}"""
        
        # Generate response
        response = model.generate_content(prompt)
        print("Raw response:", response)
        
        return response.text
    except Exception as e:
        print(f"Error in analyze_with_geminiultr: {str(e)}")
        return str(e)

@geminiultr_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    print(f"Received data: {data}")
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
        
    content = data['content']
    format = data['format']
    
    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400
    
    # Analyze content with Gemini Ultra
    analysis = analyze_with_geminiultr(content, format)
    print(f"Analysis result: {analysis}")
    
    try:
        # First remove quotes if they exist
        cleaned_analysis = analysis.strip('"')
        # Parse the string into a JSON object
        parsed_analysis = json.loads(cleaned_analysis)
        return jsonify({
            'result': parsed_analysis,
            'status': 'success'
        }), 200
    except json.JSONDecodeError:
        # Fallback to raw string if parsing fails
        return jsonify({
            'result': None,
            'status': 'error',
            'message': 'Failed to parse response as JSON array'
        }), 200
