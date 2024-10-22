import sys
import os
from dotenv import load_dotenv
import re

print("Starting script...")

# Load environment variables
load_dotenv()

#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
from groq import Groq
import requests
from googleapiclient.discovery import build
from bs4 import BeautifulSoup

print("Imported required modules")

# Use environment variables
api_key = os.getenv("GOOGLE_API_KEY")
cse_id = os.getenv("GOOGLE_CSE_ID")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

print("Initialized Groq client")

def extract_content(url):
    print(f"Extracting content from {url}")
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Extract text from p tags
        paragraphs = soup.find_all('p')
        content = ' '.join([p.get_text() for p in paragraphs])
        # Limit content to first 500 characters
        return content[:500] + "..." if len(content) > 500 else content
    except Exception as e:
        print(f"Error extracting content from {url}: {e}")
        return ""

def get_memecoins_info():
    print("Fetching memecoin information")
    """Fetch information for multiple memecoins from CoinGecko API."""
    memecoins = ["dogecoin", "shiba-inu", "pepe", "floki", "bonk"]  # Add or modify this list as needed
    memecoins_info = {}
    
    for coin_id in memecoins:
        url = f"https://api.coingecko.com/api/v3/coins/{coin_id}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            memecoins_info[coin_id] = {
                "name": data["name"],
                "symbol": data["symbol"],
                "price": data["market_data"]["current_price"]["usd"],
                "volume": data["market_data"]["total_volume"]["usd"],
                "market_cap": data["market_data"]["market_cap"]["usd"],
                "price_change_24h": data["market_data"]["price_change_percentage_24h"],
            }
        else:
            memecoins_info[coin_id] = None
    
    return memecoins_info

# Add this function to search for latest meme trends
def search_meme_trends():
    print("Searching for meme trends")
    # To get these keys:
    # 1. For Google API Key:
    #    - Go to https://console.cloud.google.com/
    #    - Create a new project or select an existing one
    #    - Enable the Custom Search API
    #    - Go to Credentials and create an API key
    # 2. For Custom Search Engine ID:
    #    - Go to https://programmablesearchengine.google.com/cse/all
    #    - Create a new search engine
    #    - Get the Search engine ID from the setup page
    # Then replace the placeholders below with your actual keys
    api_key = "AIzaSyDQDNd4dO-Erlo8Yi4v67AS_6GwuC8gyGQ"
    cse_id = "17cc80f2a12ea4b22"

    service = build("customsearch", "v1", developerKey=api_key)
    results = service.cse().list(q="latest meme trends cryptocurrency", cx=cse_id, num=5).execute()

    trends = []
    for item in results.get('items', []):
        content = extract_content(item['link'])
        trends.append({
            'title': item['title'],
            'snippet': item['snippet'],
            'link': item['link'],
            'content': content
        })
    
    return trends

# Update the market_research_agent function
def market_research_agent():
    print("Starting market research agent")
    """Agent that performs meme coin market research."""
    meme_trends = search_meme_trends()
    trends_text = "\n".join([f"- {trend['title']}:\n  Snippet: {trend['snippet']}\n  Content: {trend['content']}" for trend in meme_trends])

    research_prompt = f"""You are a cryptocurrency market research agent specializing in meme coins. Your task is to gather and summarize the latest trends, news, and market sentiment for popular meme coins. Please provide a concise report covering the following aspects:

    1. Latest price movements and trading volumes for top meme coins (e.g., Dogecoin, Shiba Inu, Pepe, Floki, Bonk)
    2. Recent news or events that might impact meme coin markets
    3. Social media trends and sentiment around meme coins
    4. Any emerging meme coins gaining traction
    5. Overall market sentiment towards meme coins

    Consider the following recent meme trends in your analysis:
    {trends_text}

    Present your findings in a structured, easy-to-read format."""

    research_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": research_prompt,
            }
        ],
        model="llama3-70b-8192",
    )

    return research_completion.choices[0].message.content

print("Performing market research")
market_research = market_research_agent()

print("Market Research Result:")
print("==============")
print(market_research)
print("==============")

print("Getting memecoin data")
memecoins_data = get_memecoins_info()

print("Combining market research and coin data")
combined_data = f"Market Research:\n{market_research}\n\nMeme Coin Data:\n{memecoins_data}"

print("Creating chat completion")
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": f"""Based on the following comprehensive data for meme coins, which includes both market research and specific coin metrics: 

{combined_data}

Please analyze the market trends and provide a decision on the single most profitable trade for a specific meme coin. Your analysis should include:

1. A summary of the current meme coin market landscape based on the provided research.
2. An overview of each coin's current market position, including price, volume, and market cap.
3. Correlation between the market research findings and the specific coin metrics.
4. Identification of any notable trends, patterns, or discrepancies between general market sentiment and individual coin performance.
5. A detailed explanation of why you've chosen a particular coin for the most profitable trade, considering both the market research and specific coin data.
6. Potential risks and factors that could affect your decision, including market volatility, regulatory concerns, and the often unpredictable nature of meme coin markets.

After your analysis, provide your final decision in the exact format of an array containing two elements: [token_name, decision]. The token_name should be a string representing the name of the meme coin you've chosen, and decision should be a boolean where true indicates buy and false indicates sell.

Focus on the coin that you believe will yield the highest profit based on the comprehensive data provided, and explain your reasoning thoroughly.""",
        }
    ],
    model="llama3-70b-8192",
)

print("Chat completion response:")
print(chat_completion.choices[0].message.content)

# Extract the Final Decision array from the response
response_content = chat_completion.choices[0].message.content
final_decision_match = re.search(r'\[([^\]]+)\]', response_content)

if final_decision_match:
    final_decision_str = final_decision_match.group(1)
    token_name, decision_str = final_decision_str.split(',')
    token_name = token_name.strip().strip("'")
    decision = decision_str.strip().lower() == 'true'
    final_decision = [token_name, decision]
    print(f"Final Decision: {final_decision}")
else:
    print("Final Decision array not found in the response.")
    final_decision = None

print("Script completed")
