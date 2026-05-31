import os 
from getpass import getpass 
from langchain_huggingface import HuggingFaceEndpointEmbeddings

os.environ["HUGGINGFACEHUB_API_TOKEN"] = getpass()

embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-mpnet-base-v2"
)

query_results = embeddings.embed_query("This is a test document.")