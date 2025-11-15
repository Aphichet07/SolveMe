## Flow การทำงานของ folder
user ส่ง req มาทาง Routes จากนั้น Routes ส่งไปให้ Controllers จัดการ req, res ถ้าไม่เกิดปํญหา Controllers จะส่งไปให้ Services ทำงานจริงๆ
โดย Services จะจัดการทั้งการ Fetch ไปที่ FastAPI ของ โฟลเดอร์ solveme-miniapp-ai โดยใช้ axios หรืออาจจะจัดการ DB ในโฟลเดอร์ Models


Routes -> Controllers -> Services -> Models