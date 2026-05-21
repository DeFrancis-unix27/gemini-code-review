## Inspiration
I wanted to build a simple tool that helps developers review their code faster. Many beginners write code that works, but they may miss bugs, security issues, or better ways to structure it. Gemini Code Review was inspired by the idea of having an AI assistant that can quickly look at code and give useful feedback.

## What it does
Gemini Code Review allows users to paste code, select or type the programming language, and submit it for review. The app sends the code to Gemini and returns feedback about possible bugs, improvements, and security issues. It helps users understand what is wrong with their code and how they can improve it.

## How I built it
I built the backend using FastAPI. I used HTML templates with Jinja2 to create the user interface, where users can paste their code and submit it through a form. The app receives the code and programming language, creates a prompt, and sends it to the Gemini API using the google-genai Python package. Gemini then generates the review feedback, which is displayed back to the user on a result page.

## Challenges I ran into
One challenge was setting up the Gemini SDK correctly because there are different packages, such as google-generativeai and google-genai, with different import styles. I also ran into template rendering issues in FastAPI and had to fix how TemplateResponse was used. Another challenge was handling API errors like quota limits and connection issues, so the app would not crash when Gemini could not respond.

## Accomplishments that I'm proud of
I am proud that I was able to connect a FastAPI web app to Gemini and make it review code through a simple user interface. I also added better error handling so users can see useful messages instead of the app failing completely. The project helped me turn an AI API into a practical tool that can support developers.

## What I learned
I learned how to build a form-based FastAPI application, use Jinja2 templates, connect to the Gemini API, and handle API responses. I also learned the importance of reading error messages carefully, especially when working with external APIs, environment variables, and package versions. This project showed me how AI can be added to web apps in a useful way.

## What's next for Gemini Code Review
Next, I would like to improve the design of the interface and display the feedback in a cleaner format. I also want to add support for multiple programming languages, save previous reviews, and allow users to download the feedback. In the future, Gemini Code Review could include code scoring, suggested fixes, and side-by-side comparisons between the original and improved code.
