from openai import OpenAI

from app.core.config import settings


def embed_text(text: str) -> list[float]:
    """Create an embedding for the provided text using OpenAI's text-embedding-3-small model."""
    if not text or not text.strip():
        return []

    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.embeddings.create(model="text-embedding-3-small", input=text)
    return response.data[0].embedding
