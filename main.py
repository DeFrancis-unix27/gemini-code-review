from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Gemini Code Reviewer")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.get("/", response_class=HTMLResponse)
async def home(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "index.html", {"request": request})


@app.post("/review")
async def review(request:Request, code: str = Form(...), language: str = Form(...)) -> HTMLResponse:
    prompt = f"""
Review this {language} code.

Give:
1. Bugs
2. Improvements
3. Security issues

Code:
{code}
"""
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        feedback = response.text

    except Exception as e:
        feedback = f"Gemini connection error: {str(e)}"
        
    return templates.TemplateResponse(request, "review.html",{
        "language":language,
        "code":code,
        "feedback":feedback,
    })