import { AiService } from "../ai.service/ai.service";
import { EorixAiService } from "../ai.logics/eorix/ai.logic";
import { OpenSourceAiService } from "../ai.logics/deepseek/open.source.ai.logic";
import { IntentClassifierService } from "../ai.intent.classifier.ts/intent.classifier";
import data from '../../data/data.json';

export class AiDecider extends AiService {
    private eorix: EorixAiService;
    private openSourceAi: OpenSourceAiService;
    private intentClassifier: IntentClassifierService;

    constructor() {
        super();
        this.eorix = new EorixAiService(data);
        this.openSourceAi = new OpenSourceAiService();
        this.intentClassifier = new IntentClassifierService();
    }

    async getReply(msg: string): Promise<{ reply: string; intent?: string; source: string}> {

        const intentResult = await this.intentClassifier.classify(msg);

        if (
            intentResult && 
            intentResult.confidence >= 0.6 &&
            this.eorix.canHandle(intentResult.intent)
        ) {
            const eorixReply = await this.eorix.getReply(msg);
            return {
                reply: eorixReply.reply,
                intent: intentResult.intent,
                source: "Eorix"
            };
        }  else {
            try {
                const openSourceAireply = await this.openSourceAi.getReply(msg);
                return { 
                    reply: openSourceAireply.reply,
                    intent: intentResult?.intent,
                    source: 'openSourceAi' 
                }
            } catch (aiError) {
                
                try {
                    const eorixReply = await this.eorix.getReply(msg);
 
                    return {
                        reply: eorixReply.reply || "Sorry, I cannot answer that right now.",
                        intent: intentResult?.intent,
                        source: "Eorix",
                    }
                } catch (error) {
                    console.error("Eorix also failed", error);

                    return {
                        reply: "Ai is not available at the moment, due to token limit for today.",
                        source: "none"
                    }
                }
                
            }
        }
        
    }
}