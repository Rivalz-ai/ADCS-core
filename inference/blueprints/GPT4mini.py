import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import requests
from bs4 import BeautifulSoup
from openai import OpenAI

# Load environment variables
load_dotenv()

gpt4mini_bp = Blueprint('gpt4mini', __name__)

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

def analyze_with_gpt4mini(content):
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    try:
        response = client.chat.completions.create(
            model="o1-mini",  # Using o1-mini model for lightweight analysis
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes content and provides concise insights."},
                {"role": "user", "content": f"Please analyze this content and provide key insights in a brief, bullet-point format: {content}"}
            ],
            max_tokens=300,  # Reduced token count for faster, more concise responses
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

@gpt4mini_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
        
    url = data['url']
    
    # Extract content from URL
    content = extract_content(url)
    
    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400
    
    # Analyze content with o1-mini
    analysis = analyze_with_gpt4mini(content)
    
    return jsonify({
        'content': content[:300] + '...' if len(content) > 300 else content,  # Shorter content preview
        'analysis': analysis
    })
