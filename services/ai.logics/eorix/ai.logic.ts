import { AiService } from '../../ai.service/ai.service';

export class EorixAiService extends AiService {
    private data: any; // class global var

    constructor(data: any) {
        super();
        this.data = data?.default ?? data;
        
        if (!this.data?.intents) {
            throw new Error("EorixAiService: Intents not loaded");
        }
    }

    private randomResponse(res: string[]): string {
        const idx = Math.floor(Math.random() * res.length);
        return res[idx];
    }

    async getReply(msg: string): Promise<{ reply: string; intent?: string; }> {
        const userMsg = msg.toLowerCase().trim();
        for (const intent of this.data.intents) {

            for (const pattern of intent.patterns) {
                const patternLower = pattern.toLowerCase().trim();

                if (userMsg === patternLower || userMsg.match(new RegExp(`\\b${patternLower}\\b`, 'i'))) {
                    return {
                        reply: this.randomResponse(intent.responses), 
                        intent: intent.tag
                    };
                }
            }
        }

        return {reply: '', intent: undefined};
    }

    canHandle(intent: string): boolean {
        const suppIntents = [
            "greeting",
            "how_are_you",
            "bye",
            "thanks",
            "name",
            "capabilities",
            "time",
            "joke",
            "weather",
            "creator",
            "age",
            "hobbies",
            "love",
            "complaint",
            "learning",
            "food",
            "music",
            "math",
            "sleep",
            "purpose",
            "dance",
            "fallback",
        ];

        return suppIntents.includes(intent);
    }
}