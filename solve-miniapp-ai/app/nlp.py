import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

# ==========================================
# 1. โครงสร้างโมเดล (Model Architecture)
# (ต้องเหมือนกับไฟล์ที่ใช้เทรนเป๊ะๆ เพื่อให้โหลดน้ำหนักได้)
# ==========================================
class SolveMeUrgencyNet(nn.Module):
    def __init__(self, base_model_name='paraphrase-multilingual-MiniLM-L12-v2'):
        super(SolveMeUrgencyNet, self).__init__()
        # โหลดโครงสร้างเปล่าๆ ของ BERT มาก่อน
        self.bert = AutoModel.from_pretrained(f'sentence-transformers/{base_model_name}')
        
        # Custom Head (ส่วนหางที่เราสร้างเพิ่ม)
        self.dropout = nn.Dropout(p=0.3)
        self.fc1 = nn.Linear(384, 128)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(128, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        
        # Mean Pooling logic
        token_embeddings = outputs.last_hidden_state
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        sentence_vector = sum_embeddings / sum_mask
        
        # Custom layers
        x = self.dropout(sentence_vector)
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return self.sigmoid(x)

# ==========================================
# 2. NLP Processor (ตัวโหลดและใช้งาน)
# ==========================================
class NLPProcessor:
    def __init__(self):
        print("Initializing NLP Engine...")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # ตำแหน่งของไฟล์โมเดล
        current_dir = os.path.dirname(os.path.abspath(__file__)) # path ของไฟล์ nlp.py
        model_folder = os.path.join(current_dir, 'my_custom_model')
        
        self.use_custom_model = False

        try:
            print(f"Looking for custom model at: {model_folder}")
            
            if os.path.exists(model_folder):
                # --- กรณีที่ 1: โหลดจากโฟลเดอร์ (Hugging Face Format) ---
                # วิธีนี้ดีที่สุดถ้าเรา save_pretrained มา
                self.tokenizer = AutoTokenizer.from_pretrained(model_folder)
                
                from transformers import AutoModelForSequenceClassification
                self.model = AutoModelForSequenceClassification.from_pretrained(model_folder)
                
                print("Custom Model Loaded (Hugging Face Format)!")
                self.use_custom_model = True
                self.model_type = "hf"
                
            else:
                # --- กรณีที่ 2: หาไม่เจอ ให้ลองหาไฟล์ .pth ---
                pth_path = os.path.join(current_dir, '../solveme_urgency_model.pth')
                if os.path.exists(pth_path):
                    print(f"Found .pth file, loading manual architecture...")
                    self.tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
                    self.model = SolveMeUrgencyNet()
                    self.model.load_state_dict(torch.load(pth_path, map_location=self.device))
                    print("Custom Model Loaded (.pth Format)!")
                    self.use_custom_model = True
                    self.model_type = "custom_class"
                else:
                    raise FileNotFoundError("No custom model found.")

            self.model.to(self.device)
            self.model.eval()

        except Exception as e:
            print(f"Failed to load custom model: {e}")
            print("Fallback: Loading standard pre-trained model from Internet...")
            
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            self.use_custom_model = False
            
            # โหลดคำศัพท์มาตรฐานไว้ใช้แก้ขัด
            self.urgent_anchors = ["ช่วยด้วย", "ฉุกเฉิน", "ด่วนมาก", "เจ็บ", "ตาย", "เลือด", "อุบัติเหตุ"]
            self.urgent_vecs = self.model.encode(self.urgent_anchors)

    def get_embedding(self, text: str):
        """สำหรับ Matching (ต้องการ Vector)"""
        if self.use_custom_model:
            inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True).to(self.device)
            with torch.no_grad():
                if self.model_type == "hf":
                    # Hack: ถ้าเป็น AutoModelForSeq... เราต้องดึง hidden states จาก base model ข้างใน
                    # (หรือจะโหลด SentenceTransformer แยกอีกตัวก็ได้ แต่วิธีนี้ประหยัดแรม)
                    if hasattr(self.model, 'bert'):
                        outputs = self.model.bert(**inputs)
                    elif hasattr(self.model, 'base_model'):
                        outputs = self.model.base_model(**inputs)
                    else:
                        # ถ้าดึงไม่ได้จริงๆ ให้โหลดตัวเล็กมาช่วย
                        if not hasattr(self, 'backup_embedder'):
                            from sentence_transformers import SentenceTransformer
                            self.backup_embedder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
                        return self.backup_embedder.encode(text)

                    token_embeddings = outputs.last_hidden_state
                    mask = inputs['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
                    return (torch.sum(token_embeddings * mask, 1) / torch.clamp(mask.sum(1), min=1e-9)).cpu().numpy()
                
                elif self.model_type == "custom_class":
                    outputs = self.model.bert(**inputs)
                    token_embeddings = outputs.last_hidden_state
                    mask = inputs['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
                    return (torch.sum(token_embeddings * mask, 1) / torch.clamp(mask.sum(1), min=1e-9)).cpu().numpy()
        
        # Fallback
        return self.model.encode(text)

    def calculate_urgency(self, text: str) -> dict:
        """คำนวณ SLA"""
        urgency_score = 0.0
        
        if self.use_custom_model:
            inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True).to(self.device)
            with torch.no_grad():
                if self.model_type == "hf":
                    logits = self.model(**inputs).logits
                    # แปลง Logits เป็น Score
                    # สมมติว่าเราเทรนแบบ 3 Class (0,1,2)
                    probs = torch.softmax(logits, dim=1)
                    # สูตร: (prob_class1 * 50 + prob_class2 * 100)
                    # สมมติว่า output มี 3 ช่อง [Non-Urgent, Medium, Critical]
                    if probs.shape[1] == 3:
                        score = (probs[0][1].item() * 50) + (probs[0][2].item() * 100)
                    else:
                        # กรณี Regression (1 ช่อง)
                        score = probs[0][0].item() * 100
                    
                    urgency_score = round(score, 2)
                    
                elif self.model_type == "custom_class":
                    score = self.model(inputs['input_ids'], inputs['attention_mask']).item()
                    urgency_score = round(score * 100, 2)
        else:
            # Fallback Logic
            vec = self.model.encode([text])
            scores = cosine_similarity(vec, self.urgent_vecs)[0]
            if np.max(scores) > 0.15:
                urgency_score = round(float(np.max(scores)) * 100, 2)

        # Map SLA
        if urgency_score >= 75:
            sla = {"tier": "P1 (Critical)", "color": "#FF0000", "size": "huge"}
        elif urgency_score >= 50:
            sla = {"tier": "P2 (High)", "color": "#FF8C00", "size": "large"}
        elif urgency_score >= 25:
            sla = {"tier": "P3 (Medium)", "color": "#FFD700", "size": "normal"}
        else:
            sla = {"tier": "P4 (Low)", "color": "#00BFFF", "size": "small"}

        return {"score": urgency_score, "sla": sla}

    def extract_keywords(self, text: str, top_n: int = 3):
        try:
            count = CountVectorizer(ngram_range=(1, 1)).fit([text])
            candidates = count.get_feature_names_out()
        except ValueError: return []
        
        doc_emb = self.get_embedding(text)
        keywords = []
        for cand in candidates:
            cand_emb = self.get_embedding(cand)
            if len(cand_emb.shape) == 1: cand_emb = cand_emb.reshape(1, -1)
            if len(doc_emb.shape) == 1: doc_emb = doc_emb.reshape(1, -1)
            score = cosine_similarity(doc_emb, cand_emb)[0][0]
            keywords.append((cand, score))
            
        keywords.sort(key=lambda x: x[1], reverse=True)
        return [k[0] for k in keywords[:top_n]]

nlp_service = NLPProcessor()