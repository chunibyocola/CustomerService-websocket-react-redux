//const types = require('../constants/CustomerServiceActionTypes');
const User = require('../model/User');
let pendingCsUserList = require('../constants/CsList').pendingCsUserList;
let waitingCsUserList = require('../constants/CsList').waitingCsUserList;
let chattingCsUserList = require('../constants/CsList').chattingCsUserList;
let staffConnectionsList = require('../constants/CsList').staffConnectionsList;
const CsUser = require('../model/CsUser');
const results = require('./results');
const utils = require('../Utils');
const MsgType = require('../constants/CustomerServiceActionTypes').MsgType;
const ChatLog = require('../model/ChatLog');
const FileUpload = require('../model/FileUpload');
const fileUploadList = require('../constants/CsList').fileUploadList;

exports.customerWsLogIn = (payload, connection) => {

    let { userId } = payload;
    if (!userId) {
        return;
    }
    let userName = 'temp';
    let user = new User(userId, userName);
    connection.userToken.setUser(user).setIsStaff(false).setLoggedIn(true);

    // have user been pending
    let csUser = pendingCsUserList.getCsUser(userId);
    if (csUser) {
        csUser.addCustomerConnection(connection);
        connection.sendUTF(results.customerWsLogInResult({ status: true }));
        return;
    }

    // have user been waiting
    csUser = waitingCsUserList.getCsUser(userId);
    if (csUser) {
        csUser.addCustomerConnection(connection);
        connection.sendUTF(results.customerRequestCsResult({ status: true }));
        return;
    }

    //have user been chatting
    csUser = chattingCsUserList.getCsUser(userId);
    if (csUser) {
        csUser.addCustomerConnection(connection);
        connection.sendUTF(results.chatAlreadyExistsResult(csUser));
        return;
    }

    csUser = new CsUser(user.getUserId()).setCustomer(user)
        .addCustomerConnection(connection);
    pendingCsUserList.addCsUser(csUser);
    connection.sendUTF(results.customerWsLogInResult({ status: true }));
};

exports.customerRequestCs = (payload, connection) => {

    let { questionText } = payload;
    let { userToken } = connection;
    let csUser = pendingCsUserList.getCsUser(userToken.getUser().getUserId());
    if (csUser) {
        csUser.setQuestionText(questionText);
        pendingCsUserList.removeCsUser(csUser);
        waitingCsUserList.addCsUser(csUser);
        connectionsSendUTF(csUser.getCustomerConnections(),
            results.customerRequestCsResult({ status: true }));
    }
};

exports.customerCancelRequestCs = (payload, connection) => {

    let { userToken } = connection;
    let csUser = waitingCsUserList.getCsUser(userToken.getUser().getUserId());
    if (csUser) {
        csUser.setQuestionText(null);
        waitingCsUserList.removeCsUser(csUser);
        pendingCsUserList.addCsUser(csUser);
        connectionsSendUTF(csUser.getCustomerConnections(),
            results.customerCancelRequestCsResult({}));
    }
};

exports.staffWsLogIn = (payload, connection) => {

    let { userToken } = connection;
    let { userId, userPw } = payload;
    if (!userId) {
        return;
    }
    let userName = 'tempStaffName';
    let user = new User(userId, userName);
    userToken.setUser(user).setIsStaff(true).setLoggedIn(true);
    staffConnectionsList.push(connection);
    connection.sendUTF(results.staffWsLogInResult({ status: true }));
};

exports.staffAcceptCustomer = (payload, connection) => {
    
    let { userToken } = connection;
    if (!userToken.getLoggedIn() || !userToken.getIsStaff()) {
        return;
    }
    let user = userToken.getUser();
    let userId = user.getUserId();
    let csUser = waitingCsUserList.getFirst();
    if (csUser) {
        chattingCsUserList.addCsUser(csUser);
        let timeStamp = utils.getTimeStamp();
        csUser.setStaffId(userId).setStaffConnection(connection)
            .setChatId(utils.getTimeStamp()).setStaff(user)
            .addChatLog(new ChatLog(
                csUser.getCustomerId(), csUser.getQuestionText(), 
                MsgType.TEXT, timeStamp
            ));
        connection.sendUTF(
            results.staffAcceptCustomerResult(csUser, timeStamp)
        );
        connectionsSendUTF(csUser.getCustomerConnections(), 
            results.requestCsSuccessResult(csUser, timeStamp));
    }
};

exports.msgGetRead = (payload, connection) => {

    let { userToken } = connection;
    if (!userToken.getIsStaff()) {
        return;
    }
    let senderId = userToken.getUser().getUserId();
    let { targetId } = payload;
    let csUser = chattingCsUserList.getCsUser(targetId);
    if (csUser) {
        connectionsSendUTF(csUser.getCustomerConnections(),
            results.msgGetReadResult(senderId));
    }
};

exports.customerSendMsg = (payload, connection) => {

    let { userToken } = connection;
    let customerId = userToken.getUser().getUserId();
    let { targetId, msg, msgId } = payload;

    let csUser = chattingCsUserList.getCsUser(customerId);
    if (csUser) {
        let timeStamp = utils.getTimeStamp();
        csUser.addChatLog(new ChatLog(
            customerId, msg, MsgType.TEXT, timeStamp
        ));
        csUser.getCustomerConnections().map((item) => {
            if (item !== connection) {
                item.sendUTF(results.msgFromOwnResult(
                    targetId, customerId, msg, MsgType.TEXT
                ));
            }
        });
        connection.sendUTF(results.customerSendMsgSuccessResult(targetId, msgId));
        csUser.getStaffConnection().sendUTF(results.receiveMsgResult(
            customerId, msg, MsgType.TEXT, timeStamp
        ));
    }
};

exports.staffSendMsg = (payload, connection) => {

    let { userToken } = connection;
    if (!userToken.getIsStaff()) {
        return;
    }
    let staffId = userToken.getUser().getUserId();
    let { targetId, msg, msgId } = payload;
    let csUser = chattingCsUserList.getCsUser(targetId);
    if (csUser && csUser.getStaffConnection() === connection) {
        let timeStamp = utils.getTimeStamp();
        csUser.addChatLog(new ChatLog(
            staffId, msg, MsgType.TEXT, timeStamp
        ));
        connection.sendUTF(results.staffSendMsgSuccessResult(
            targetId, msgId
        ));
        connectionsSendUTF(csUser.getCustomerConnections(), results.receiveMsgResult(
            staffId, msg, MsgType.TEXT, timeStamp
        ));
    }
    
};

exports.staffCloseChat = (payload, connection) => {

    let { userToken } = connection;
    if (!userToken.getIsStaff()) {
        return;
    }
    let { targetId } = payload;
    let csUser = chattingCsUserList.getCsUser(targetId);
    if (csUser && csUser.getStaffConnection() === connection) {
        chattingCsUserList.removeCsUser(csUser);
        pendingCsUserList.addCsUser(csUser);
        csUser.cleanToPending();
        connectionsSendUTF(csUser.getCustomerConnections(), 
            results.csChatEndResult());
        connection.sendUTF(results.staffCloseChatSuccessResult(targetId));
    }
};

exports.fileUploadHead = (payload, connection) => {

    let { userToken } = connection;
    if (!userToken.getLoggedIn()) {
        return;
    }
    let { targetId, type, size, fileId, msgType } = payload;
    let fileUpload = new FileUpload(targetId, type, size, fileId, msgType);
    fileUpload.createFile((err, fileName) => {
        let status = true;
        if (err) {
            status = false;
        }
        connection.sendUTF(results.fileUploadHeadResult(
            status, fileName, fileId
        ));
    });
    fileUploadList.addFileUpload(fileUpload);
};

exports.fileUploadFragment = (payload, connection) => {

    let { userToken } = connection;
    if (!userToken.getLoggedIn()) {
        return;
    }
    let { fileFragment, fileName } = payload;
    let fileUpload = fileUploadList.getFileUploadByFileName(fileName);
    if (fileUpload) {
        fileUpload.appendFile(fileFragment);
        connection.sendUTF(results.fileUploadFragmentResult(
            fileName, fileUpload.getAllowResendTimes(), true
        ));
        return;
    }
    connection.sendUTF(results.fileUploadFragmentResult(
        fileName, 0, false
    ));
};

exports.fileUploadEnd = (payload, connection) => {

    let { userToken } = connection;
    if (!userToken.getLoggedIn()) {
        return;
    }
    let isStaff = userToken.getIsStaff();
    let userId = userToken.getUser().getUserId();
    let { fileName } = payload;
    let fileUpload = fileUploadList.getFileUploadByFileName(fileName);
    if (fileUpload) {
        fileUpload.closeWriteStream();
        connection.sendUTF(results.fileUploadEndResult(fileName, true));
        fileUploadList.removeFileUpload(fileUpload);
        let targetId = fileUpload.getTargetId();
        let msg = `<img class='chat-img' src='http://localhost:1235/${ 
            fileUpload.getFileName() }' />`;
        if (isStaff) {
            let csUser = chattingCsUserList.getCsUserByCustomerIdAndStaffId(
                targetId, userId
            );
            if (csUser) {
                connectionsSendUTF(csUser.getCustomerConnections(), 
                    results.receiveMsgResult(
                        userId, 
                        msg,
                        MsgType.IMAGE,
                        utils.getTimeStamp()
                ));
            }
        }
        else {
            let csUser = chattingCsUserList.getCsUser(userId);
            if (csUser) {
                csUser.getStaffConnection().sendUTF(
                    results.receiveMsgResult(
                        userId,
                        msg,
                        MsgType.IMAGE,
                        utils.getTimeStamp()
                    )
                );
                csUser.getCustomerConnections().map((item) => {
                    if (item !== connection) {
                        item.sendUTF(results.msgFromOwnResult(
                            targetId, userId, msg, MsgType.IMAGE
                        ));
                    }
                });
            }
        }
        return;
    }
    connection.sendUTF(results.fileUploadEndResult(fileName, false));
};

let sendWaitingCountTimeOut = setInterval(() => sendWaitingCount(), 1000);
const sendWaitingCount = () => {

    connectionsSendUTF(staffConnectionsList, 
        results.csWaitingCountResult(waitingCsUserList.getCount()));
    waitingCsUserList.getList().map((item, index) => {
        connectionsSendUTF(item.getCustomerConnections(), 
            results.csWaitingCountResult(index));
    });
};

const connectionsSendUTF = (connectionsList, data) => {

    connectionsList.map((item) => {
        item.sendUTF(data);
    });
};