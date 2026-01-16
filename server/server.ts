import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AiDecider } from '../services/ai.decider/ai.decider';

dotenv.config();

// server class
class Server {
    private app = express();
    private port = process.env.PORT || 5000;
    private aiDecider = new AiDecider();

    constructor () {   
        this.app.use(cors());
        this.app.use(express.json());
        this.routes();
    }

    private routes() {
        this.app.post('/chat', async (req: Request, res: Response) => {
            const userMsg: string = req.body.message;
            if (!userMsg || userMsg.trim() === '') {
                return res.status(400).json({error: 'Message is required'});
            }

            const aiReply = await this.aiDecider.getReply(userMsg);
            return res.json(aiReply);
        });
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`EORIX API running on http://localhost:${this.port}`);
        });
    }
}

const server = new Server();
server.start();