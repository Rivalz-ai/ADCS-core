import os
import json
import requests
from dotenv import load_dotenv
import openai
from flask import Blueprint, request, jsonify
# Load environment variables
load_dotenv()

crypto_analyzer_bp = Blueprint('crypto_analyzer', __name__)

class CryptoAnalyzer:
    def __init__(self):
        self.cmc_api_key = os.getenv('COINMARKETCAP_API_KEY')
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        
        if not self.cmc_api_key or not self.openai_api_key:
            raise ValueError("Please set both COINMARKETCAP_API_KEY and OPENAI_API_KEY in .env file")
            
        openai.api_key = self.openai_api_key

    def get_market_data(self, limit=10):
        """Fetch top cryptocurrencies data from CoinMarketCap"""
        url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
        headers = {
            'X-CMC_PRO_API_KEY': self.cmc_api_key,
        }
        parameters = {
            'limit': limit,
            'convert': 'USD'
        }
        
        try:
            response = requests.get(url, headers=headers, params=parameters)
            response.raise_for_status()
            return response.json()['data']
        except requests.exceptions.RequestException as e:
            print(f"Error fetching market data: {e}")
            return None

    def analyze_market_data(self, market_data):
        """Analyze market data using GPT"""
        if not market_data:
            return {"action": "none", "reason": "No market data available"}

        # Prepare market data for analysis
        analysis_prompt = self._prepare_analysis_prompt(market_data)
        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a cryptocurrency market analyst. Analyze the given market data and provide a recommendation in JSON format with 'action' (buy/none) and 'token_symbol' if action is buy, along with a 'reason'."},
                    {"role": "user", "content": analysis_prompt}
                ]
            )
            
            # Parse the response and ensure it's in the correct format
            try:
                result = json.loads(response.choices[0].message.content)
                return result
            except json.JSONDecodeError:
                return {"action": "none", "reason": "Failed to parse AI response"}
            
        except Exception as e:
            print(f"Error during AI analysis: {e}")
            return {"action": "none", "reason": "AI analysis failed"}

    def _prepare_analysis_prompt(self, market_data):
        """Prepare market data for GPT analysis"""
        analysis_text = "Analyze the following cryptocurrency market data:\n\n"
        
        for coin in market_data:
            quote = coin['quote']['USD']
            analysis_text += f"Token: {coin['symbol']}\n"
            analysis_text += f"Price: ${quote['price']:.2f}\n"
            analysis_text += f"24h Change: {quote['percent_change_24h']:.2f}%\n"
            analysis_text += f"7d Change: {quote['percent_change_7d']:.2f}%\n"
            analysis_text += f"Market Cap: ${quote['market_cap']:.2f}\n"
            analysis_text += f"Volume 24h: ${quote['volume_24h']:.2f}\n\n"

        analysis_text += "\nBased on this data, provide a recommendation in the following JSON format:\n"
        analysis_text += '{"action": "buy/none", "token_symbol": "BTC", "reason": "explanation"}\n'
        analysis_text += "Only recommend 'buy' if there's a strong positive indicator. Otherwise, return 'none' as the action."
        
        return analysis_text

@crypto_analyzer_bp.route('/analyze', methods=['POST'])
def analyze():
    analyzer = CryptoAnalyzer()
    # Get market data
    print("Fetching market data...")
    market_data = analyzer.get_market_data()
    
    if market_data:
        print("\nAnalyzing market data...")
        result = analyzer.analyze_market_data(market_data)
        json_result = json.dumps(result)
        print("\nAnalysis Result:")
        print(json_result)
        return json_result
    else:
        print("Failed to fetch market data. Please check your API key and try again.")