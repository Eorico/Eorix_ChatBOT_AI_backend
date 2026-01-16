from fastapi import FastAPI
from pydantic import BaseModel
import joblib, os 

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "intent_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")


model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

class TextInput(BaseModel):
    text:str

@app.post("/predict-intent")
def predictIntent(input: TextInput):
    x = vectorizer.transform([input.text])
    probs = model.predict_proba(x)[0]
    confidence = max(probs)
    intent = model.classes_[probs.argmax()]
    
    return {
        "intent": intent,
        "confidence": float(confidence)
    }