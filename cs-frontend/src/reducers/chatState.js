import * as types from '../constants/CustomerServiceActionTypes'; 

const initState = {};

const MsgStatus = types.MsgStatus;
const MsgType = types.MsgType;

const chatState = (state = initState, action) => {

    let { type, payload } = action;

    switch(type) {
        case types.STAFF_ACCEPT_CUSTOMER: // action: { type, userInfo, chatLog }
        {
            let msgCount = 1, msgStart = 0, unreadCount = 1;
            let { customerInfo, chatLog } = payload;
            chatLog = { 
                ...chatLog, msgStatus: MsgStatus.UNREAD, 
                msgId: msgStart, msgType: chatLog.msgType 
            };
            state[customerInfo.userId] = { 
                customerInfo, chatLogs: [].concat(chatLog), msgCount, unreadCount 
            };
            return { ...state };
        }
        case types.REQUEST_CS_SUCCESS: // action: { type, staffInfo, chatLog }
        {
            let msgCount = 1, msgStart = 0, unreadCount = 0;
            let { staffInfo, chatLog } = payload;
            chatLog = { 
                ...chatLog, msgStatus: MsgStatus.UNREAD, 
                msgId: msgStart, msgType: chatLog.msgType 
            };
            state[staffInfo.userId] = { 
                staffInfo, chatLogs: [].concat(chatLog), msgCount, unreadCount 
            };
            return { ...state };
        }
        case types.CHAT_ALREADY_EXISTS: // action: { type, staffInfo, chatLogsList }; chatLogsList: [chatLog, ...]
        {
            let unreadCount = 0;
            let { staffInfo, chatLogs } = payload;
            chatLogs = chatLogs.map((item, index) => {
                return { ...item, msgStatus: MsgStatus.READ, msgId: index };
            }); 
            state[staffInfo.userId] = { staffInfo, chatLogs: chatLogs, msgCount: chatLogs.length, unreadCount: unreadCount }
            return { ...state };
        }
        case types.CUSTOMER_SEND_MSG: // action: { type, targetId, msg, msgId, userId }
        {
            let { targetId, msg, msgId, senderId } = payload;
            let chatLog = { 
                senderId: senderId, 
                msg: msg, 
                msgStatus: MsgStatus.SENDING, 
                msgId: msgId,
                msgType: MsgType.TEXT
            };
            state[targetId].chatLogs = state[targetId].chatLogs.concat(chatLog);
            state[targetId].msgCount++;
            return { ...state }
        }
        case types.CUSTOMER_SEND_MSG_SUCCESS: // action: { type, msgId, staffId }
        {
            let { targetId, msgId } = payload;
            state[targetId].chatLogs[msgId].msgStatus = MsgStatus.UNREAD;
            return { ...state };
        }
        case types.MSG_FROM_OWN: // action: { tpye, targetId, senderId, msg }
        {
            let { targetId, senderId, msg, msgType } = payload;
            let chatLog = {
                senderId,
                msg,
                msgStatus: MsgStatus.UNREAD,
                msgId: state[targetId].msgCount,
                msgType
            }
            state[targetId].chatLogs = state[targetId].chatLogs.concat(chatLog);
            state[targetId].msgCount++;
            return { ...state };
        }
        case types.STAFF_SEND_MSG: // action: { type, targetId, msg, msgId, staffId }
        {
            let { targetId, msg, msgId, senderId } = payload;
            let chatLog = { 
                senderId: senderId, 
                msg: msg, 
                msgStatus: MsgStatus.SENDING, 
                msgId: msgId,
                msgType: MsgType.TEXT
            };
            state[targetId].chatLogs = state[targetId].chatLogs.concat(chatLog);
            state[targetId].msgCount++;
            console.log(state);
            return { ...state };
        }
        case types.STAFF_SEND_MSG_SUCCESS: // action: { type, msgId, userId }
        {
            let { targetId, msgId } = payload;
            state[targetId].chatLogs[msgId].msgStatus = MsgStatus.UNREAD;
            return { ...state };
        }
        case types.STAFF_CLOSE_CHAT_SUCCESS: // action: { type, targetId }
        {
            let { targetId } = payload;
            delete state[targetId];
            return { ...state };
        }
        case types.RECEIVE_MSG: // action: { type, chatLog, flag }
        {
            let { chatLog, flag } = payload;
            let senderId = chatLog.senderId;
            chatLog = { ...chatLog, msgId: state[senderId].msgCount };
            state[senderId].chatLogs = state[senderId].chatLogs.concat(chatLog);
            state[senderId].msgCount++;
            state[senderId].unreadCount += flag;
            return { ...state };
        }
        case types.READ_MSG: // action: { type, targetId }
        {
            let { targetId } = payload;
            state[targetId].unreadCount = 0;
            return { ...state };
        }
        case types.MSG_GET_READ: // action: { type, senderId }
        {
            state[payload.senderId].chatLogs.map(
                (chatLog) => { 
                    if (chatLog.senderId !== action.senderId) {
                        chatLog.msgStatus = MsgStatus.READ;
                    }
                    return chatLog;
                }
            );
            return { ...state };
        }
        case types.FILE_UPLOAD_HEAD: 
        {
            let { targetId, senderId, dataUrl, msgId, status } = payload;
            let msgStatus = status? MsgStatus.SENDING: MsgStatus.WRONG;
            let chatLog = { 
                senderId, msg: `<img class='chat-img' src='${ dataUrl }' />`,
                msgStatus, msgType: MsgType.IMAGE, msgId
            };
            state[targetId].chatLogs = state[targetId].chatLogs.concat(chatLog);
            state[targetId].msgCount++;
            return { ...state };
        }
        case types.FILE_UPLOAD_END: // action: { type, targetId, msgId }
        {
            let { targetId, msgId, status } = payload;
            let msgStatus = status? MsgStatus.UNREAD: MsgStatus.WRONG;
            console.log(msgStatus);
            state[targetId].chatLogs[msgId].msgStatus = msgStatus;
            return { ...state };
        }
        default:
            return state;
    }
};

export default chatState;