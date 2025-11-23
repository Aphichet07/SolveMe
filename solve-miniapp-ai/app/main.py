from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from app.nlp import nlp_service
from app.translation import translator_service
from app.matching   import matching_service

app = FastAPI()

# Define request models
class TextRequest(BaseModel):
    text: str


class TranslateRequest(BaseModel):
    text: str
    target_lang: str

class Helper(BaseModel):
    user_id : str
    name : str
    tasg : List[str]

# api endpoints

@app.get("/")
def read_root():
    return {"Status : AI Service Ready"}

@app.post('/analyze-importance')
def analyze_text(req: TextRequest):

    keywords = nlp_servcie.extract_keywords(req.text)
    return{
        "text": req.text,
        "keywords": keywords
    }

@app.post('/analyze-urgency')
def analyze_urgency(req: TextRequest):

    result = nlp_service.calculate_urgency(req.text)
    return{
        "text": req.text,
        "analysis": result
    }

@app.post("/match-helpers")
def match_helpers(req: MatchRequest):
   
   results = rank_helpers(req.problem_text,[h.dict() for h in req.helpers], nlp_service)

   return {
        "problem" : req.problem_text,
        "matches" : results
   }

@app.post('/translate')
def translate_message(req: TranslateRequest):

    translated_text = translator_service.translate_text(req.text, req.target_lang)
    return {
        "original_text": req.text,
        "translated_text": translated_text,
        "target_lang": req.target_lang
    }


