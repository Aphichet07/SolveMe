import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// กำหนดตำแหน่งไฟล์ Log (ให้อยู่นอกโฟลเดอร์ utils)
const LOG_FILE_PATH = path.join(__dirname, '../user_logs.csv');

export const logUserInteraction = (text, aiResult) => {
    try {
        // 1. เช็คว่าไฟล์มีอยู่ไหม ถ้าไม่มีให้สร้าง Header ก่อน
        if (!fs.existsSync(LOG_FILE_PATH)) {
            const header = 'timestamp,text,urgency_score,sla_tier,keywords\n';
            fs.writeFileSync(LOG_FILE_PATH, header, 'utf8');
        }

        // 2. เตรียมข้อมูลที่จะบันทึก
        const timestamp = new Date().toISOString();
        // ต้อง Escape เครื่องหมายคอมมา (,) ในข้อความ เพื่อไม่ให้ CSV พัง
        const safeText = `"${text.replace(/"/g, '""')}"`; 
        const score = aiResult.urgency.score;
        const tier = aiResult.urgency.sla.tier;
        const keywords = `"${aiResult.keywords.join('|')}"`; // ใช้ | คั่น keywords

        const logLine = `${timestamp},${safeText},${score},${tier},${keywords}\n`;

        // 3. บันทึกต่อท้ายไฟล์ (Append)
        fs.appendFileSync(LOG_FILE_PATH, logLine, 'utf8');
        
        console.log('Logged to CSV');
    } catch (error) {
        console.error('Logging Error:', error);
    }
};