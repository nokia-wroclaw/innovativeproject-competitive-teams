FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

WORKDIR /app

# Install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Expose backend port
EXPOSE 5000

# Copy backend files
COPY ./app /app/app/

# Run backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
