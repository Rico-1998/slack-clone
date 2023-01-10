export class Channel {
    public channelName: string;
    public channelDescription: string;
    public messages: string [] = [];
    public created: Date;


    public toJSON() {
        return {
            channelName: this.channelName,
            channelDescription: this.channelDescription,
            messages: this.messages,
            created: this.created

        }
    }
}