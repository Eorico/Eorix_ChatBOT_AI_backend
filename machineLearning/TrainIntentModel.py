import json, joblib, os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "..", "data", "data.json")

class TrainerModelIntent:
    def __init__(this, dataPath: str):
        this.dataPath = dataPath
        this.texts = []
        this.labels = []
        this.data = None
        
        this.vectorizer = TfidfVectorizer()
        this.model = LogisticRegression(max_iter=1000)
        
    def loadIntents(this):
        with open(this.dataPath, 'r', encoding='utf-8') as f:
            this.data = json.load(f)
            
    def intentIteration(this):
        for intent in this.data["intents"]:
            for pattern in intent["patterns"]:
                this.texts.append(pattern)
                this.labels.append(intent["tag"])
                
    def train(this):
        x = this.vectorizer.fit_transform(this.texts)
        this.model.fit(x, this.labels)
        
    def saveModel(this):
        joblib.dump(this.model, "intent_model.pkl")
        joblib.dump(this.vectorizer, "vectorizer.pkl")
        
    def run(this):
        this.loadIntents()
        this.intentIteration()
        this.train()
        this.saveModel()
        print("Intent model trained and save succesfully")
        
if __name__ == "__main__":
    trainer = TrainerModelIntent(DATA_FILE)
    trainer.run()