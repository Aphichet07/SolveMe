from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# Import service จากไฟล์ที่เราสร้าง
from app.nlp import nlp_service
from app.matching import rank_helpers
from app.translation import translator_service

app = FastAPI(title="SolveMe AI Service")

# --- Data Models ---
class TextRequest(BaseModel):
    text: str

class TranslateRequest(BaseModel):
    text: str
    target_lang: str = 'th'

class Helper(BaseModel):
    id: str
    name: str
    tags: List[str]

class MatchRequest(BaseModel):
    problem_text: str
    helpers: List[Helper]

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"status": "AI Service Ready"}

@app.post("/analyze-importance")
def analyze_text(req: TextRequest):
    keywords = nlp_service.extract_keywords(req.text)
    return {"text": req.text, "keywords": keywords}

@app.post("/analyze-urgency")
def analyze_urgency(req: TextRequest):
    result = nlp_service.calculate_urgency(req.text)
    return {"text": req.text, "analysis": result}

# --- (FIXED) ส่วนที่คุณต้องการแก้ ---
@app.post("/match-helpers")
def match_helpers(req: MatchRequest):
    """
    จับคู่คนช่วย (Matching)
    รับ: ข้อความปัญหา + รายชื่อคนช่วย
    คืน: รายชื่อคนช่วยที่เรียงลำดับแล้ว (พร้อมคะแนน)
    """
    # 1. เรียกฟังก์ชัน rank_helpers จากไฟล์ matching.py
    # เราต้องแปลง req.helpers (ที่เป็น Pydantic model) ให้เป็น list of dicts
    helpers_data = [h.dict() for h in req.helpers]
    
    results = rank_helpers(req.problem_text, helpers_data, nlp_service)
    
    return {
        "problem": req.problem_text,
        "matches": results
    }

@app.post("/translate")
def translate_message(req: TranslateRequest):
    translated_text = translator_service.translate_text(req.text, req.target_lang)
    return {
        "original": req.text,
        "translated": translated_text,
        "target_lang": req.target_lang
    }