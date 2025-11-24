import torch
import pandas as pd
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW 
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.model_selection import train_test_split

# --- 1. ตั้งค่า (Config) ---
MODEL_NAME = 'paraphrase-multilingual-MiniLM-L12-v2'
DATA_FILE = 'urgency_dataset.csv'
OUTPUT_DIR = 'my_custom_model'
EPOCHS = 10   #เทรน 10 รอบ
BATCH_SIZE = 10 #เทรนทีละ 10          
LEARNING_RATE = 2e-5    

# --- 2. เตรียมตัวอ่านข้อมูล (Dataset Class) ---
class UrgencyDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            # (FIX) แปลง label เป็น int ก่อนส่งให้ torch
            'labels': torch.tensor(int(label), dtype=torch.long)
        }

# --- 3. ฟังก์ชันเทรน (Training Function) ---
def train():
    print(f"Starting Training with model: {MODEL_NAME}")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on: {device}")

    # โหลดข้อมูล
    try:
        df = pd.read_csv(DATA_FILE)
        # (FIX) บังคับแปลงคอลัมน์ label ให้เป็นตัวเลข (กันพลาด)
        df['label'] = pd.to_numeric(df['label'], errors='coerce').fillna(0).astype(int)
        print(f"Loaded {len(df)} examples from {DATA_FILE}")
    except FileNotFoundError:
        print("Error: ไม่พบไฟล์ dataset! กรุณาสร้างไฟล์ urgency_dataset.csv ก่อน")
        return

    # โหลดสมองตั้งต้น
    tokenizer = AutoTokenizer.from_pretrained(f'sentence-transformers/{MODEL_NAME}')
    model = AutoModelForSequenceClassification.from_pretrained(
        f'sentence-transformers/{MODEL_NAME}',
        num_labels=3 # 0, 1, 2
    )
    model.to(device)

    # เตรียมข้อมูล
    dataset = UrgencyDataset(df.text.to_numpy(), df.label.to_numpy(), tokenizer)
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

    optimizer = AdamW(model.parameters(), lr=LEARNING_RATE)

    # เริ่มลูปการสอน
    model.train()
    for epoch in range(EPOCHS):
        total_loss = 0
        print(f"\n🎓 Epoch {epoch + 1}/{EPOCHS}")
        
        for batch in dataloader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)

            optimizer.zero_grad()
            
            outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()

        avg_loss = total_loss / len(dataloader)
        print(f"Average Loss: {avg_loss:.4f}")

    # บันทึกโมเดล
    print("\nSaving model...")
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f" Done! Model saved to folder: '{OUTPUT_DIR}'")

if __name__ == "__main__":
    train()