import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

geminipro_bp = Blueprint('geminipro', __name__)

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

def analyze_with_geminipro(content):
    try:
        # Initialize Gemini-Pro model
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt
        prompt = """You are an AI assistant that do whatever in the content provided.
        
        Instructions:
        1. Do whatever in the content provided
        2. get the desired return format in the content provided
        3. return with exact format
        
        Content : """ + content
        
        # Generate response
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        return str(e)

@geminipro_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
        
    url = data['url']
    
    # Extract content from URL
    content = extract_content(url)
    
    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400
    
    # Analyze content with Gemini Pro
    analysis = analyze_with_geminipro(content)
    
    return jsonify({
        'content': content[:500] + '...' if len(content) > 500 else content,
        'analysis': analysis
    })
