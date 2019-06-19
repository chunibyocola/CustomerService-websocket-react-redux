const utils = require('../Utils');

module.exports = class FileUploadList {
    
    constructor() {
        this.list = [];
        this.removeOverTimeFileUploadInterval = setInterval(() => {
            this.removeOverTimeFileUpload();
        }, 5000);
        return this;
    }

    removeOverTimeFileUpload() {
        let currentTimeStamp = Number(utils.getTimeStamp());
        let overTimeFileUploadList = this.list.filter((value) => {
            // over 10s
            return currentTimeStamp - Number(value.getUpdateTimeStamp()) > 10000;
        });
        overTimeFileUploadList.map((item) => {
            this.removeFileUpload(item);
        });
    }

    getFileUploadByFileName(fileName) {
        let index = this.list.find((value) => {
            return value.getFileName() === fileName;
        });
        if (index) {
            return index;
        }
        return null;
    }

    addFileUpload(fileUpload) {
        this.list.push(fileUpload);
        return this;
    }

    removeFileUpload(fileUpload) {
        let index = this.list.indexOf(fileUpload);
        if (index >= 0) {
            this.list.splice(index, 1);
        }
        return this;
    }
};