const types = require('../constants/CustomerServiceActionTypes');
const ChatLog = require('../model/ChatLog');

exports.customerWsLogInResult = (payload) => {
    return packData(types.CUSTOMER_WS_LOG_IN, payload);
};

exports.customerRequestCsResult = (payload) => {
    return packData(types.CUSTOMER_REQUEST_CS, payload);
};

exports.customerCancelRequestCsResult = (payload) => {
    return packData(types.CUSTOMER_CANCEL_REQUEST_CS, payload);
};

exports.staffWsLogInResult = (payload) => {
    return packData(types.STAFF_WS_LOG_IN, payload);
};

exports.staffAcceptCustomerResult = (csUser, timeStamp) => {
    let senderId = csUser.getCustomerId();
    let msg = csUser.getQuestionText();
    let msgType = types.MsgType.TEXT;
    let chatLogJson = getChatLogJson(senderId, msg, msgType, timeStamp);
    let customerInfo = csUser.getCustomer().getJson();
    let payload = { chatLog: chatLogJson, customerInfo: customerInfo };
    return packData(types.STAFF_ACCEPT_CUSTOMER, payload);
};

exports.requestCsSuccessResult = (csUser, timeStamp) => {
    let senderId = csUser.getCustomerId();
    let msg = csUser.getQuestionText();
    let msgType = types.MsgType.TEXT;
    let chatLogJson = getChatLogJson(senderId, msg, msgType, timeStamp);
    let staffInfo = csUser.getStaff().getJson();
    let payload = { chatLog: chatLogJson, staffInfo: staffInfo };
    return packData(types.REQUEST_CS_SUCCESS, payload);
};

exports.msgGetReadResult = (senderId) => {
    return packData(types.MSG_GET_READ, { senderId });
};

exports.customerSendMsgSuccessResult = (targetId, msgId) => {
    return packData(types.CUSTOMER_SEND_MSG_SUCCESS, { targetId, msgId });
};

exports.staffSendMsgSuccessResult = (targetId, msgId) => {
    return packData(types.STAFF_SEND_MSG_SUCCESS, { targetId, msgId });
};

exports.receiveMsgResult = (senderId, msg, msgType, timeStamp) => {
    return packData(types.RECEIVE_MSG, { chatLog: getChatLogJson(
        senderId, msg, msgType, timeStamp
    )});
};

exports.msgFromOwnResult = (targetId, senderId, msg, msgType) => {
    return packData(types.MSG_FROM_OWN, {
        targetId, senderId, msg, msgType
    });
};

exports.staffCloseChatSuccessResult = (targetId) => {
    return packData(types.STAFF_CLOSE_CHAT_SUCCESS, { targetId });
};

exports.csChatEndResult = () => {
    return packData(types.CS_CHAT_END, {});
};

exports.chatAlreadyExistsResult = (csUser) => {
    return packData(types.CHAT_ALREADY_EXISTS, { 
        staffInfo: csUser.getStaff().getJson(),
        chatLogs: csUser.getChatLogsArray()
    });
};

exports.csWaitingCountResult = (waitingCount) => {
    return packData(types.CS_WAITING_COUNT, { waitingCount });
};

exports.fileUploadHeadResult = (status, fileName, fileId) => {
    return packData(types.FILE_UPLOAD_HEAD, { status, fileName, fileId });
};

exports.fileUploadFragmentResult = (fileName, allowResendTimes, status) => {
    return packData(types.FILE_UPLOAD_FRAGMENT, { 
        fileName, allowResendTimes, status 
    });
};

exports.fileUploadEndResult = (fileName, status) => {
    return packData(types.FILE_UPLOAD_END, { fileName, status });
};

const getChatLogJson = (senderId, msg, msgType, timeStamp) => {
    let chatLog = new ChatLog(senderId, msg, msgType, timeStamp);
    return chatLog.getJson();
};

const packData = (type, payload) => {
    let obj = { type, payload };
    return JSON.stringify(obj);
};