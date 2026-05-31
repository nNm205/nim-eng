import os
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="hf-inference",
    api_key="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",
)

result = client.feature_extraction(
    "Today is a sunny day and I will get some ice cream.",
    model="ibm-granite/granite-embedding-97m-multilingual-r2",
)

print(result)