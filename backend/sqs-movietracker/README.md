# MovieTracker Backend Dev Guide

## Create and activate virtual environment
```bash
python3 -m venv venv source venv/bin/activate
```

## Install requirements
```bash
pip install -r requirements.txt
```

## Run
```bash
uvicorn main:app --reload --port 8000
```

## Setup DB
alembic upgrade head