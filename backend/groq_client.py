# groq_client.py
from fastapi.exceptions import HTTPException
import os
import time
from groq import Groq, RateLimitError, APIError
from dotenv import load_dotenv


load_dotenv()


client = Groq(api_key=os.environ["GROQ_API_KEY"])

MODEL = "llama-3.3-70b-versatile"


def call_groq(messages: list[dict], model: str = MODEL, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.9,  # roast needs personality, not corporate tone
                max_tokens=800,
            )
            return response.choices[0].message.content

        except RateLimitError:
            wait = 2 ** attempt  # exponential backoff — same pattern as your ScoutAI runner
            if attempt < max_retries - 1:
                time.sleep(wait)
                continue
            raise HTTPException(
                status_code=429,
                detail="Groq rate limit hit — try again in a moment."
            )

        except APIError as e:
            raise HTTPException(status_code=502, detail=f"LLM provider error: {str(e)}")

    raise HTTPException(status_code=500, detail="Failed after retries.")


def call_groq_stream(messages: list[dict], model: str = MODEL, max_retries: int = 3):
    """Generator that yields tokens from Groq's streaming API."""
    for attempt in range(max_retries):
        try:
            stream = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.9,
                max_tokens=800,
                stream=True,
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
            return  # successful — exit the retry loop

        except RateLimitError:
            wait = 2 ** attempt
            if attempt < max_retries - 1:
                time.sleep(wait)
                continue
            raise HTTPException(
                status_code=429,
                detail="Groq rate limit hit — try again in a moment."
            )

        except APIError as e:
            raise HTTPException(status_code=502, detail=f"LLM provider error: {str(e)}")

    raise HTTPException(status_code=500, detail="Failed after retries.")