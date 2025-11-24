import requests
import sys
import json

# URL ของ API Server (ต้องรัน uvicorn อยู่ก่อนนะ)
API_URL = "http://127.0.0.1:8000"

def print_colored(text, color_code):
    print(f"{color_code}{text}\033[0m")

def test_ai_chat():
    print("\n" + "="*50)
    print("SolveMe AI Tester (Interactive CLI)")
    print("="*50)
    print("พิมพ์ข้อความปัญหาของคุณ แล้วกด Enter")
    print("พิมพ์ 'exit' หรือ 'q' เพื่อออกจากโปรแกรม\n")

    while True:
        try:
            user_input = input("\n👤 User: ").strip()
        except KeyboardInterrupt:
            print("\nExiting...")
            break

        if user_input.lower() in ['exit', 'q', 'quit']:
            print("บ๊ายบาย!")
            break
        
        if not user_input:
            continue

        print("AI กำลังวิเคราะห์...", end="\r")

        try:
            # 1. ยิง API วิเคราะห์ความด่วน (Urgency)
            response = requests.post(f"{API_URL}/analyze-urgency", json={"text": user_input})
            
            if response.status_code == 200:
                data = response.json()
                analysis = data['analysis']
                score = analysis['score']
                sla = analysis['sla']
                
                # เคลียร์บรรทัด "กำลังวิเคราะห์..."
                print(" " * 30, end="\r")

                # แสดงผลลัพธ์แบบสวยงาม
                print(f"ผลการวิเคราะห์สำหรับ: \"{user_input}\"")
                print(f"   • คะแนนความด่วน: {score}/100")
                print(f"   • ระดับ SLA:     {sla['tier']}")
                print(f"   • เวลาช่วยเหลือ: {sla['mins']} นาที")
                
                # แสดงสีตามระดับความด่วน
                # สีแดง (Critical), สีเหลือง (High), สีเขียว (Normal/Low)
                if score >= 75:
                    print_colored(f"   • STATUS: 🔴 CRITICAL (ฉุกเฉินมาก!)", "\033[91m")
                elif score >= 50:
                    print_colored(f"   • STATUS: 🟠 HIGH (ด่วน)", "\033[93m")
                elif score >= 25:
                    print_colored(f"   • STATUS: 🟡 MEDIUM (ปานกลาง)", "\033[93m")
                else:
                    print_colored(f"   • STATUS: 🟢 LOW (ทั่วไป)", "\033[92m")

            else:
                print(f"\nServer Error: {response.status_code}")
                print(response.text)

        except requests.exceptions.ConnectionError:
            print("\nเชื่อมต่อ Server ไม่ได้!")
            print("อย่าลืมรัน: python -m uvicorn app.main:app --port 8000 ในอีกหน้าต่างนะครับ")
            break
        except Exception as e:
            print(f"\nเกิดข้อผิดพลาด: {e}")

if __name__ == "__main__":
    # เช็คก่อนว่ามี requests ไหม
    try:
        import requests
    except ImportError:
        print("ไม่พบไลบรารี 'requests'")
        print("กรุณารัน: pip install requests")
        sys.exit(1)
        
    test_ai_chat()