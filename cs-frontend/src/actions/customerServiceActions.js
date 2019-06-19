import * as types from '../constants/CustomerServiceActionTypes';
import { sendCustomerSendMsg, sendStaffSendMsg } from '../websocket-client/wsSend';

export const readMsg = (targetId) => {
    return {
        type: types.READ_MSG,
        payload: {
            targetId
        }
    };
};

export const staffChattingWith = (customerId) => {
    return {
        type: types.STAFF_CHATTING_WITH,
        payload: {
            customerId
        }
    };
};

export const customerSendMsg = (targetId, msg, msgId, senderId) => {
    sendCustomerSendMsg(targetId, msg, msgId);
    return {
        type: types.CUSTOMER_SEND_MSG,
        payload: {
            targetId, msg, msgId, senderId
        }
    };
};

export const staffSendMsg = (targetId, msg, msgId, senderId) => {
    sendStaffSendMsg(targetId, msg, msgId);
    return {
        type: types.STAFF_SEND_MSG,
        payload: {
            targetId, msg, msgId, senderId
        }
    };
};

export const customerQuitChat = () => {
    return {
        type: types.CUSTOMER_QUIT_CHAT,
        payload: {}
    }
};