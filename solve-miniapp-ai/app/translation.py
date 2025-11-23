from deep_translator import GoogleTranslator

class TranslationService:
    def __init__(self):
        print("TranslationService initialized")
    
    def translate_text(self, text:str, target_lang: str = 'th'): # Translates text to the target language using Google Translate
        
        try:
            translated = GoogleTranslator(source='auto', target=target_lang).translate(text,)
            return translated
        except Exception as e:
            print(f"Translation error: {e}")
            return text
        

translator_service = TranslationService()