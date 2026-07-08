from langchain_groq import ChatGroq
from ..config import settings

# Primary model - use a supported model
llm = ChatGroq(
    model="llama-3.3-70b-versatile",  # Changed from gemma2-9b-it
    api_key=settings.GROQ_API_KEY,
    temperature=0,
)

llm_large = ChatGroq(
    model="llama-3.3-70b-versatile",  # Use the same supported model
    api_key=settings.GROQ_API_KEY,
    temperature=0.3,
)