export class Comments {
    public author: string;
    public msg: string;
    public timestamp: number;
    public userId: string;

    constructor(obj?: any){
        this.author = obj ? obj.author : '';
        this.timestamp = obj ? obj.timestamp : new Date().getTime();
        this.msg = obj ? obj.msg : '';
        this.userId = obj ? obj.userId : '';
    }

    public toJson(): any{
        return {
            timestamp: this.timestamp,
            userId: this.userId,
            msg: this.msg,
            author: this.author
        }
    }
}