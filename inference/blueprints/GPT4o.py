import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
import json

# Load environment variables
load_dotenv()

gpt4_bp = Blueprint('gpt4', __name__)

def extract_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
            
        # Get text content
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        return str(e)

def analyze_with_gpt4(content,format):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    try:
        # Create prompt
        prompt = f"""You are an AI assistant that do whatever in the content provided.
        
        Instructions:
        1. Do whatever in the content provided
        2. get the desired return format in the content provided
        3. return with exact format
        
        Content: {content}
        Return your response in this exact format: {format}
        Example: if format is [decision,name], you should return something like ["yes","John"]"""
        
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        print(content,format)
        print(response.choices[0].message.content)
        
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

@gpt4_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    
    if not data or 'content' not in data:
        return jsonify({'error': 'URL is required'}), 400
        
    content = data['content']
    format = data['format']

    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400
    
    # Analyze content with GPT-4
    analysis = analyze_with_gpt4(content,format)
    
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
