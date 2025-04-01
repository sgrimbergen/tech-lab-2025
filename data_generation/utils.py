import json
import random
from openai import AzureOpenAI
import pandas as pd


def get_unit():
    """Extract the packaging method as text"""
    with open("../data/packaging_methods.json", "r") as file:
        packaging_methods = json.load(file)
    return random.choice(packaging_methods)


def get_products() -> pd.DataFrame:
    return pd.read_json("../data/products.json")


def generate_order_message(productA: str, productB: str) -> str:
    prompt = "Write something here that generates an order!"

    key = "COPY FROM .ENV"
    endpoint = "COPY FROM .ENV"
    model = "COPY FROM .ENV"

    client = AzureOpenAI(
            api_key=key, api_version="2024-10-01-preview", azure_endpoint=endpoint
        )
    messages = [
        {"role": "user", "content": prompt},
               ]
    response = client.chat.completions.create(
                model=model, messages=messages
            )
    return response.choices[0].message.content
