## ใช้จัดการเกี่ยวกับโมเดลทั้งหมด รวมไปถึงการเรียกใช้ API จากฝั่ง Backend

ก่อนเริ่มทำงานครั้งแรกให้สร้าง environment แยกออกมาก่อนใช้คำสั่ง

    python -m venv venv

หลังจากสร้างแล้วให้เปิดใช้งาน ด้วยคำสั่งนี้ทุกครั้งที่ทำงาน

    venv\Scripts\activate

หลังจาก activate environment ข้างบนแล้ว
ให้ติดตั้ง library ก่อนโดยใช้คำสั่งนี้(ทำครั้งเดียว แค่ตอนสร้าง environment ครั้งแรก)

    pip install -r requirements.txt

ซึ่งกุเตรียม library ที่น่าจะตั้งใช้ไว้แล้ว



# Folder Flow
-ทำงานใน folder app เป็นหลัก

ไฟล์อื่นจะทำอะไรก็ได้แต่ ไฟล์ main.py ต้องเอาไว้เรียก API เท่านั้น