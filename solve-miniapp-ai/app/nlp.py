import torch
from transformers import AutoTokenizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.model_architecture import SolveMeUrgencyNet

class NLPProcessor:
    def __init__(self):
        print("Loading Custom Trained Model... 🧠")
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # 1. โหลด Tokenizer
        try:
            self.tokenizer = AutoTokenizer.from_pretrained('./saved_tokenizer')
        except:
            # Fallback ถ้าหาไม่เจอ ให้โหลดจากเน็ต
            self.tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

        # 2. โหลด Model Architecture & Weights
        self.model = SolveMeUrgencyNet()
        try:
            # โหลดน้ำหนักสมองที่เราเทรนมา (Weights)
            self.model.load_state_dict(torch.load('solveme_urgency_model.pth', map_location=self.device))
            print("✅ Custom Weights Loaded Successfully!")
        except FileNotFoundError:
            print("⚠️ Warning: Model weights not found. Using untrained model.")
        
        self.model.to(self.device)
        self.model.eval() # เปิดโหมดใช้งานจริง (ปิด Dropout)

    def get_embedding(self, text: str):
        """ใช้สำหรับ Matching (ยังคงต้องใช้ BERT Backbone เดิม)"""
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True).to(self.device)
        with torch.no_grad():
            outputs = self.model.bert(**inputs)
            # Mean Pooling
            token_embeddings = outputs.last_hidden_state
            mask = inputs['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
            sum_embeddings = torch.sum(token_embeddings * mask, 1)
            sum_mask = torch.clamp(mask.sum(1), min=1e-9)
            return (sum_embeddings / sum_mask).cpu().numpy()

    def calculate_urgency(self, text: str) -> dict:
        """
        ใช้โมเดล Custom ทำนายคะแนนความด่วน (0-1) โดยตรง!
        (ไม่ต้องเทียบกับ Anchors แล้ว เพราะโมเดลเรียนรู้มาแล้ว)
        """
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True).to(self.device)
        
        with torch.no_grad():
            # ให้โมเดลทำนายออกมาเลย (ค่าระหว่าง 0 - 1)
            score = self.model(inputs['input_ids'], inputs['attention_mask']).item()
        
        # แปลงเป็นเปอร์เซ็นต์
        urgency_score = round(score * 100, 2)

        # Map SLA (เหมือนเดิม)
        if urgency_score >= 75:
            sla = {"tier": "P1 (Critical)", "mins": 15, "color": "#FF0000", "size": "huge"}
        elif urgency_score >= 50:
            sla = {"tier": "P2 (High)", "mins": 30, "color": "#FF8C00", "size": "large"}
        elif urgency_score >= 25:
            sla = {"tier": "P3 (Medium)", "mins": 60, "color": "#FFD700", "size": "normal"}
        else:
            sla = {"tier": "P4 (Low)", "mins": 120, "color": "#00BFFF", "size": "small"}

        return {
            "score": urgency_score,
            "sla": sla
        }

    def extract_keywords(self, text: str, top_n: int = 3):
        # (ใช้ Logic เดิมได้เลย หรือจะปรับปรุงก็ได้)
        n_gram_range = (1, 1)
        try:
            count = CountVectorizer(ngram_range=n_gram_range).fit([text])
            candidates = count.get_feature_names_out()
        except ValueError:
            return []
        
        doc_emb = self.get_embedding(text)
        cand_emb = self.get_embedding(candidates) # ต้องแก้ get_embedding ให้รองรับ batch ถ้าจะให้เร็ว
        
        # ... (ส่วน Keyword ใช้ Logic เดิมไปก่อนได้ครับ เพื่อความง่าย) ...
        return [] 

# สร้าง Instance
nlp_service = NLPProcessor()