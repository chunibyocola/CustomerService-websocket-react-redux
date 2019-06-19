const CsUserList = require('../model/CsUserList');
const FileUploadList = require('../model/FileUploadList');

exports.pendingCsUserList = new CsUserList();
exports.waitingCsUserList = new CsUserList();
exports.chattingCsUserList = new CsUserList();
exports.staffConnectionsList = [];
exports.fileUploadList = new FileUploadList();