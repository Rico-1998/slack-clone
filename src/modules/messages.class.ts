export class Message {
    messageText: string;
    timestamp: number;
    userId: string;

    constructor(obj?: any){
        this.messageText = obj ? obj.messageText : '';
        this.timestamp = obj ? obj.timestamp : new Date().getTime();
        this.userId = obj ? obj.userId : '';
    }

    public toJson(): any{
        return {
            timestamp: this.timestamp,
            userId: this.userId,
            messageText:this.messageText,
        }
    }

}