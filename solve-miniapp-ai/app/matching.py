from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def calculate_match_score(problem_text: str, helper_tags: list, nlp_service):
    """
    คำนวณคะแนนความเหมาะสม (0-100%) ระหว่าง 'ข้อความปัญหา' กับ 'Tags ของคนช่วย'
    """
    # กรณีคนช่วยไม่มี Tags อะไรเลย (เช่น เป็นคนทั่วไป) -> ให้คะแนน 0 หรือคะแนนพื้นฐานต่ำๆ
    if not helper_tags or len(helper_tags) == 0:
        return 0.0

    # 1. แปลงข้อความปัญหาเป็น Vector (ตัวเลข) โดยใช้ NLP Service
    # (ฟังก์ชัน get_embedding จะเลือกใช้ Custom Model หรือ Pre-trained ให้อัตโนมัติ)
    problem_vec = nlp_service.get_embedding(problem_text)
    
    # 2. เอา Tags ของคนช่วยมารวมกันเป็นประโยคเดียว แล้วแปลงเป็น Vector
    # ตัวอย่าง: tags = ["ซ่อมรถ", "มีเครื่องมือ", "เปลี่ยนยาง"] -> text = "ซ่อมรถ มีเครื่องมือ เปลี่ยนยาง"
    helper_text = " ".join(helper_tags)
    helper_vec = nlp_service.get_embedding(helper_text)

    # 3. คำนวณ Cosine Similarity (วัดมุมระหว่าง 2 Vector)
    # reshape(1, -1) จำเป็นต้องทำเพื่อให้ format ตรงกับที่ sklearn ต้องการ (2D Array)
    score = cosine_similarity(problem_vec.reshape(1, -1), helper_vec.reshape(1, -1))[0][0]
    
    # 4. แปลงเป็นคะแนนเต็ม 100 และปัดเศษ
    # ค่า score ปกติจะอยู่ระหว่าง -1 ถึง 1 (แต่ส่วนใหญ่ใน NLP จะเป็น 0 ถึง 1)
    final_score = round(float(score) * 100, 2)
    
    # กันเหนียว: ถ้าคะแนนติดลบ ให้เป็น 0
    return max(final_score, 0.0)

def rank_helpers(problem_text: str, helpers_list: list, nlp_service):
    """
    ฟังก์ชันหลัก: รับรายการคนช่วยทั้งหมด -> คำนวณคะแนนทุกคน -> เรียงลำดับจากมากไปน้อย
    """
    ranked_results = []
    
    for helper in helpers_list:
        # คำนวณคะแนนของแต่ละคน
        score = calculate_match_score(problem_text, helper['tags'], nlp_service)
        
        # เก็บผลลัพธ์ลง list
        ranked_results.append({
            "helper_id": helper['id'],
            "name": helper['name'],
            "match_score": score,
            "tags": helper['tags']
        })
    
    # เรียงลำดับตามคะแนนจาก มาก -> น้อย (Reverse=True)
    ranked_results.sort(key=lambda x: x['match_score'], reverse=True)
    
    return ranked_results