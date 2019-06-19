class ChatLog {

    constructor(senderId, msg, msgType, timeStamp) {
        this.senderId = senderId;
        this.msg = msg;
        this.msgType = msgType;
        this.timeStamp = timeStamp;
        return this;
    }

    getSenderId() {
        return this.senderId;
    }

    getMsg() {
        return this.msg;
    }

    getMsgType() {
        return this.msgType;
    }

    getTimeStamp() {
        return this.timeStamp;
    }

    getJson() {
        return {
            senderId: this.senderId,
            msg: this.msg,
            msgType: this.msgType,
            timeStamp: this.timeStamp
        };
    }
}

module.exports = ChatLog;