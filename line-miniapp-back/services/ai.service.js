import axios from 'axios';

// URL ของ AI Service (ต้องตรงกับ Port ที่ Python รันอยู่)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export const analyzeBubble = async (text) => {
    try {
        // ยิง 2 API พร้อมกันเพื่อความรวดเร็ว (Parallel Requests)
        const [urgencyRes, keywordRes] = await Promise.all([
            // 1. วิเคราะห์ความเร่งด่วน (SLA) -> ได้ Score, สีฟอง, ขนาดฟอง
            axios.post(`${AI_SERVICE_URL}/analyze-urgency`, { text }),
            
            // 2. วิเคราะห์คำสำคัญ (Keywords) -> ได้ Tags
            axios.post(`${AI_SERVICE_URL}/analyze-importance`, { text })
        ]);

        return {
            // ข้อมูลความด่วน (เอาไปใช้เลือกสีและขนาดฟองใน Frontend)
            urgency: urgencyRes.data.analysis, 
            // ตัวอย่าง data.analysis: 
            // { score: 85.5, sla: { tier: "P1", color: "#FF0000", size: "huge" } }

            // ข้อมูล Keywords (เอาไปใช้ Search หรือ Tag)
            keywords: keywordRes.data.keywords 
            // ตัวอย่าง keywords: ["ยางแตก", "รถมอเตอร์ไซค์"]
        };

    } catch (error) {
        console.error("⚠️ AI Service Error:", error.message);
        
        // Fallback: ถ้า AI ล่ม ให้คืนค่า Default กลางๆ ไปก่อน (ระบบจะได้ไม่พัง)
        return {
            urgency: { 
                score: 0, 
                sla: { 
                    tier: "Unknown", 
                    color: "#808080", // สีเทา (General)
                    size: "normal" 
                } 
            },
            keywords: []
        };
    }
};

/**
 * ฟังก์ชันสำหรับจับคู่ (ใช้ตอน Helper กดค้นหางานที่เหมาะกับตัวเอง)
 */
export const rankHelpers = async (problemText, helpersList) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/match-helpers`, {
            problem_text: problemText,
            helpers: helpersList
        });
        return response.data.matches;
    } catch (error) {
        console.error("⚠️ AI Matching Error:", error.message);
        return helpersList; // ถ้าพัง ส่ง list เดิมกลับไป
    }
};