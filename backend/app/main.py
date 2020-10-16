"""
    main.py
"""

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def greet():
    return {"message": "Hello world!"}
