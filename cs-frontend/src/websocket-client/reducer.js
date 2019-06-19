import * as types from '../constants/CustomerServiceActionTypes';
import { getStoreDispatch, getStoreState } from '../store';
import { sendMsgGetRead } from './wsSend';
import { fileUploadHeadSuccess, nextFileUploadFragment, fileUploadEnd } 
    from '../utils/fileUpload';

const dispatch = getStoreDispatch();

export const middleDispatch = (action) => {
    
    let { type, payload } = action;

    switch (type) {
        case types.WEB_SOCKET_READY_STATE_CHANGE:
            break;
        case types.CUSTOMER_WS_LOG_IN:
            dispatch(action);
            break;
        case types.CUSTOMER_REQUEST_CS:
            dispatch(action);
            break;
        case types.CUSTOMER_CANCEL_REQUEST_CS:
            dispatch(action);
            break;
        case types.STAFF_WS_LOG_IN:
            dispatch(action);
            break;
        case types.STAFF_ACCEPT_CUSTOMER:
            dispatch(action);
            break;
        case types.REQUEST_CS_SUCCESS:
            dispatch(action);
            break;
        case types.MSG_GET_READ:
            dispatch(action);
            break;
        case types.CUSTOMER_SEND_MSG_SUCCESS:
            dispatch(action);
            break;
        case types.STAFF_SEND_MSG_SUCCESS:
            dispatch(action);
            break;
        case types.RECEIVE_MSG:
            let { staffCsState, customerCsState } = getStoreState();
            let { wsLoggedIn: staffLoggedIn, chattingWith: staffChattingWith } 
                = staffCsState;
            let { wsLoggedIn: customerLoggedIn, chattingWith: customerChattingWith }
                = customerCsState;
            let chattingWith;
            if (staffLoggedIn) {
                chattingWith = staffChattingWith;
            } 
            else if (customerLoggedIn) {
                chattingWith = customerChattingWith;
            }
            let { chatLog } = payload;
            let senderId = chatLog.senderId;
            let flag = senderId === chattingWith ? 0 : 1;
            if (chattingWith === senderId) {
                sendMsgGetRead(chattingWith);
            }
            action.payload = { ...payload, flag };
            dispatch(action);
            break;
        case types.CS_CHAT_END:
            dispatch(action);
            break;
        case types.STAFF_CLOSE_CHAT_SUCCESS:
            dispatch(action);
            break;
        case types.CHAT_ALREADY_EXISTS:
            dispatch(action);
            break;
        case types.MSG_FROM_OWN:
            dispatch(action);
            break;
        case types.CS_WAITING_COUNT:
            dispatch(action);
            break;
        case types.FILE_UPLOAD_HEAD:
            fileUploadHeadSuccess(payload, dispatch);
            break;
        case types.FILE_UPLOAD_FRAGMENT:
            nextFileUploadFragment(payload);
            break;
        case types.FILE_UPLOAD_END:
            fileUploadEnd(payload, dispatch);
            break;
        default:
            break;
    }
};