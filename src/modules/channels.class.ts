export class Channel {
    public channelName: string;
    public channelDescription: string;
    public created: Date;


    public toJSON() {
        return {
            channelName: this.channelName,
            channelDescription: this.channelDescription,
            created: this.created

        }
    }
}