# main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from extractor import extract_text
from groq_client import call_groq, call_groq_stream

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

ROAST_SYSTEM_PROMPT = """You are a hilarious resume roaster with a savage sense of humour. 
You are roasting the user's resume like a stand-up comedian doing a friendly roast — brutal 
but never boring, sharp but never actually hurtful.

You always reply in Roman script (Hinglish), mixing Hindi and English naturally the way 
Indian students/developers talk to each other — never pure Hindi in Devanagari script.


Style rules:
- Be funny first, harsh second — this should make the user laugh, not actually feel bad
- Use desi comparisons, and typical Hinglish roast lines wherever it fits 
  naturally (but don't force it if it feels random)
- Keep sentences punchy — short jabs land better than long paragraphs
- DO NOT give any advice, suggestions, or improvement tips unless the user explicitly asks 
  for them. Your first job is ONLY to roast. If the user wants help, they'll ask — tab dena.


Never insult personal appearance, family, caste, religion, gender, or anything unrelated to 
the resume itself. Keep the roast about the CONTENT of the resume, not the person."""

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

@app.post("/roast")
async def roast_resume(
    file: UploadFile = File(...),
):
    # Step 1: extract text
    text = await extract_text(file)

    # Step 2: build initial roast prompt
    messages = [
        {"role": "system", "content": ROAST_SYSTEM_PROMPT},
        {"role": "user", "content": f"Roast this resume:\n\n{text}"}
    ]

    # Step 3: call Groq
    roast = call_groq(messages)

    return {
        "roast": roast,
        "history": messages + [{"role": "assistant", "content": roast}]
    }


@app.post("/chat")
async def continue_chat(
    history: list[ChatMessage]
):
    # frontend sends full history including new user message appended
    messages = [{"role": m.role, "content": m.content} for m in history]

    reply = call_groq(messages)

    return {
        "reply": reply,
        "history": messages + [{"role": "assistant", "content": reply}]
    }


# ─── Streaming endpoints ───────────────────────────────────────────

@app.post("/roast-stream")
async def roast_resume_stream(
    file: UploadFile = File(...),
):
    """Stream the initial roast token-by-token via SSE."""
    text = await extract_text(file)

    messages = [
        {"role": "system", "content": ROAST_SYSTEM_PROMPT},
        {"role": "user", "content": f"Roast this resume:\n\n{text}"}
    ]

    def event_generator():
        # First, send the extracted resume text so frontend can store it in history
        yield f"data: {json.dumps({'type': 'meta', 'resume_text': text})}\n\n"
        try:
            for token in call_groq_stream(messages):
                yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except HTTPException as e:
            yield f"data: {json.dumps({'type': 'error', 'message': e.detail, 'status': e.status_code})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e), 'status': 500})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/chat-stream")
async def continue_chat_stream(
    history: list[ChatMessage],
):
    """Stream follow-up chat replies token-by-token via SSE."""
    # Prepend system prompt server-side so frontend doesn't need to duplicate it
    messages = [{"role": "system", "content": ROAST_SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in history]

    def event_generator():
        try:
            for token in call_groq_stream(messages):
                yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except HTTPException as e:
            yield f"data: {json.dumps({'type': 'error', 'message': e.detail, 'status': e.status_code})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e), 'status': 500})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )