import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
import google.generativeai as genai
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

geminiadvanced_bp = Blueprint('geminiadvanced', __name__)

def analyze_with_geminiadvanced(content, format):
    try:
        # Initialize Gemini-Pro model with advanced settings
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Create prompt
        prompt = f"""You are an AI assistant that analyzes content and returns structured decisions.
        
        Instructions:
        1. Analyze the provided content
        2. Return your response in EXACTLY the array format specified
        3. Do not add any additional text or explanation
        4. Make sure the response can be parsed as a valid JSON array
        
        Content: {content}
        
        Return your response in this exact format: {format}
        Example: if format is [decision,name], you should return something like ["yes","John"]"""
        
        # Generate response with more detailed configuration
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.9,
                top_k=40,
                max_output_tokens=1024,
                candidate_count=1
            )
        )
        print("Raw response:", response)
        
        return response.text
    except Exception as e:
        print(f"Error in analyze_with_geminiadvanced: {str(e)}")
        return str(e)

@geminiadvanced_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    print(f"Received data: {data}")
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
        
    content = data['content']
    format = data['format']
    
    if not content:
        return jsonify({'error': 'Failed to extract content'}), 400
    
    # Analyze content with Gemini Advanced
    analysis = analyze_with_geminiadvanced(content, format)
    print(f"Analysis result: {analysis}")
    
    try:
        # First remove quotes if they exist
        cleaned_analysis = analysis.strip('"')
        # Parse the string into a JSON array
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
