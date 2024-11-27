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

geminiflash8b_bp = Blueprint('geminiflash8b', __name__)

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

def analyze_with_geminiflash8b(content):
    try:
        # Initialize Gemini-1.5-flash-8b model
        model = genai.GenerativeModel('gemini-1.5-flash-8b')
        
        # Create prompt
        prompt = """You are a helpful assistant that analyzes content and provides insights.
        Please analyze this content and provide key insights: """ + content
        
        # Generate response with flash configuration
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.5,  # Lower temperature for more focused responses
                candidate_count=1,
                top_p=0.8,
                top_k=20,
                max_output_tokens=512,  # Shorter responses for faster generation
            )
        )
        
        return response.text
    except Exception as e:
        return str(e)

@geminiflash8b_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
        
    url = data['url']
    
    # Extract content from URL
    content = extract_content(url)
    
    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400
    
    # Analyze content with Gemini Flash 8B
    analysis = analyze_with_geminiflash8b(content)
    
    return jsonify({
        'content': content[:500] + '...' if len(content) > 500 else content,
        'analysis': analysis
    })
