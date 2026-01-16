export abstract class AiService {
    // each of the two ai must have a contract function of getReply
    abstract getReply(msg: string): Promise<{reply: string, intent?:string}>;
}