#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
from groq import Groq
import requests

client = Groq(
    api_key="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",
)

def get_memecoins_info():
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


def market_research_agent():
    """Agent that performs meme coin market research."""
    research_prompt = """You are a cryptocurrency market research agent specializing in meme coins. Your task is to gather and summarize the latest trends, news, and market sentiment for popular meme coins. Please provide a concise report covering the following aspects:

    1. Latest price movements and trading volumes for top meme coins (e.g., Dogecoin, Shiba Inu, Pepe, Floki, Bonk)
    2. Recent news or events that might impact meme coin markets
    3. Social media trends and sentiment around meme coins
    4. Any emerging meme coins gaining traction
    5. Overall market sentiment towards meme coins

    Present your findings in a structured, easy-to-read format."""

    research_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": research_prompt,
            }
        ],
        model="llama3-8b-8192",
    )

    return research_completion.choices[0].message.content

# Perform market research
market_research = market_research_agent()

# Get meme coin data
memecoins_data = get_memecoins_info()

# Combine market research and coin data for analysis
combined_data = f"Market Research:\n{market_research}\n\nMeme Coin Data:\n{memecoins_data}"

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
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)



"""
coin_info = get_memecoin_info("dogecoin")
if coin_info:
    print(f"Memecoin info: {coin_info}")
else:
    print("Failed to fetch memecoin information")
"""
