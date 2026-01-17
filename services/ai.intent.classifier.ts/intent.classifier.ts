import axios from "axios";

export interface IntentResult {
    intent: string;
    confidence: number;
}

export class IntentClassifierService {
    private readonly endpoint = "https://eorix-chatbot-ai-backend-ml.onrender.com/predict-intent";
    private readonly threshold = 0.6;

    async classify(text: string): Promise<IntentResult | null> {
        try {
            const res = await axios.post(this.endpoint, { text });

            if (res.data.confidence < this.threshold) {
                return null;
            }

            return res.data;
        } catch (err) {
            console.error("Intent classifier unavailable");
            return null;
        }
    }
}
