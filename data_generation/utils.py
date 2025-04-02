import json
import random
import os 
from openai import AzureOpenAI
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file for using gpt-4o-mini
load_dotenv()

def get_unit():
    """Extract the packaging method as text"""
    with open("../data/packaging_methods.json", "r") as file:
        packaging_methods = json.load(file)
    return random.choice(packaging_methods)


def get_products() -> pd.DataFrame:
    return pd.read_json("../data/products.json")


def generate_order_message(productA: str, productB: str) -> str:
    prompt = "Write something here that generates an order!"

    api_version = os.getenv("API_VERSION")
    key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    model = os.getenv("AZURE_OPENAI_GPT_DEPLOYMENT")

    client = AzureOpenAI(
            api_key=key, api_version=api_version, azure_endpoint=endpoint
        )
    messages = [
        {"role": "user", "content": prompt},
               ]
    response = client.chat.completions.create(
                model=model, messages=messages
            )
    return response.choices[0].message.content
