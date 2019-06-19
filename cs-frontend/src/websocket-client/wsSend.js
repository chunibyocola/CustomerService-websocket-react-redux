import { sendDataToServer } from './index';
import * as types from '../constants//CustomerServiceActionTypes';

export const sendCustomerWsLogIn = (userState) => {
    sendDataToServer(packData(types.CUSTOMER_WS_LOG_IN, userState));
};

export const sendCustomerRequestCs = (questionText) => {
    sendDataToServer(packData(types.CUSTOMER_REQUEST_CS, { questionText }));
};

export const sendCustomerCancelRequestCs = () => {
    sendDataToServer(packData(types.CUSTOMER_CANCEL_REQUEST_CS));
};

export const sendStaffWsLogIn = (userId, userPw) => {
    sendDataToServer(packData(types.STAFF_WS_LOG_IN, { userId, userPw }));
};

export const sendStaffAcceptCustomer = () => {
    sendDataToServer(packData(types.STAFF_ACCEPT_CUSTOMER, {}));
};

export const sendMsgGetRead = (targetId) => {
    sendDataToServer(packData(types.MSG_GET_READ, { targetId }));
};

export const sendCustomerSendMsg = (targetId, msg, msgId) => {
    sendDataToServer(packData(types.CUSTOMER_SEND_MSG, {
        targetId, msg, msgId
    }));
};

export const sendStaffSendMsg = (targetId, msg, msgId) => {
    sendDataToServer(packData(types.STAFF_SEND_MSG, {
        targetId, msg, msgId
    }));
};

export const sendStaffCloseChat = (targetId) => {
    sendDataToServer(packData(types.STAFF_CLOSE_CHAT, { targetId }));
};

export const sendFileUploadHead = (targetId, type, size, fileId, msgType) => {
    sendDataToServer(packData(types.FILE_UPLOAD_HEAD, {
        targetId, type, size, fileId, msgType
    }));
};

export const sendFileUploadFragment = (fileName, fileFragment) => {
    sendDataToServer(packData(types.FILE_UPLOAD_FRAGMENT, {
        fileName, fileFragment
    }));
};

export const sendFileUploadEnd = (fileName) => {
    sendDataToServer(packData(types.FILE_UPLOAD_END, { fileName }));
};

const packData = (type, payload = {}) => {
    return JSON.stringify({ type, payload });
};