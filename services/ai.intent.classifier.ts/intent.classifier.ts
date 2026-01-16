import axios from "axios";

export interface IntentResult {
    intent: string;
    confidence: number;
}

export class IntentClassifierService {
    private readonly endpoint = "http://127.0.0.1:8000/predict-intent";
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
