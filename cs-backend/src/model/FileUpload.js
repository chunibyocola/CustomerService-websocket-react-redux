const utils = require('../Utils');
const crypto = require('crypto');
const fs = require('fs');
const basePath = 'E:\\Projects\\JS\\CustomerService\\static-server\\src\\static';

module.exports = class FileUpload {
    
    constructor(targetId, fileType, fileSize, fileId, msgType) {

        this.targetId = targetId;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.fileId = fileId;
        this.currentSize = 0;
        this.allowResendTimes = 3;
        this.fileName = null;
        this.updateTimeStamp = utils.getTimeStamp();
        this.writeStream = null;
        this.msgType = msgType;
        return this;
    }

    createFile(callback) {
        
        this.fileName = crypto.createHash('md5').update(utils.getTimeStamp())
            .digest("hex") + '.' + this.fileType;
        try {
            this.writeStream = fs.createWriteStream(basePath + '\\' + this.fileName);
            this.writeStream.on('open', () => {
                callback(null, this.fileName);
            });
            this.writeStream.on('error', (err) => {
                throw err;
            });
            this.setUpdateTimeStamp(utils.getTimeStamp());
        }
        catch (err) {
            callback(err, this.fileName);
        }
        return this;
    }

    appendFile(fileFragment) {
        let buf = Buffer.from(fileFragment, 'base64');
        this.writeStream.write(buf);
        this.setUpdateTimeStamp(utils.getTimeStamp());
        return this;
    }

    closeWriteStream() {
        this.writeStream.close();
        return this;
    }

    getTargetId() {
        return this.targetId;
    }

    getAllowResendTimes() {
        return this.allowResendTimes;
    }

    getFileName() {
        return this.fileName;
    }

    setUpdateTimeStamp(timeStamp) {
        this.updateTimeStamp = timeStamp;
        return this;
    }

    getUpdateTimeStamp() {
        return this.updateTimeStamp;
    }
};