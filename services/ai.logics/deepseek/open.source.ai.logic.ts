import dotenv from 'dotenv';
import { OpenRouter } from '@openrouter/sdk';
import { AiService } from '../../ai.service/ai.service';

dotenv.config();

export class OpenSourceAiService extends AiService {
    private client: OpenRouter;

    constructor() {
        super();
        this.client = new OpenRouter({ apiKey: process.env.AI_API_KEY });
    }

    async getReply(msg: string): Promise<{ reply: string; intent?: string; }> {
        const res = await this.client.chat.send({
            model: 'deepseek/deepseek-r1-0528:free',
            messages: [
                { role: 'system', content: 'You are a friendly AI assistant name EORIX' },
                { role: 'user', content: msg },
            ],
            stream: true
        });

         let fullResponse = '';

        for await (const chunk of res) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                fullResponse += content;    
                process.stdout.write(content);  
            }
        }

        return {reply: fullResponse}
    }
}