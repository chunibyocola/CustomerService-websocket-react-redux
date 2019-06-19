import * as types from '../constants/CustomerServiceActionTypes';

const initState = {
    wsReadyState: 0,
    wsLoggedIn: false,
    csRequesting: false,
    csRequestSuc: false,
    csRequestSucAndEnd: false,
    chattingWith: '',
    waitingCount: 0
};

const customerCsState = (state = initState, action) => {

    let { type, payload } = action;
    switch(type) { // readyState: WebSocket.readyState
        // Common
        case types.WEB_SOCKET_READY_STATE_CHANGE:
            return { ...state, wsReadyState: payload.readyState };
        // User
        case types.CUSTOMER_WS_LOG_IN:
            return { ...state, wsLoggedIn: payload.status };
        case types.CUSTOMER_REQUEST_CS:
            return { 
                ...state, 
                csRequesting: payload.status, 
                wsLoggedIn: true,
                csRequestSucAndEnd: false
            };
        case types.CUSTOMER_CANCEL_REQUEST_CS:
            return { ...state, csRequesting: false };
        case types.REQUEST_CS_SUCCESS:
            return { 
                ...state, 
                csRequestSuc: true, 
                csRequesting: false, 
                chattingWith: payload.staffInfo.userId,
                csRequestSucAndEnd: false
            };
        case types.CHAT_ALREADY_EXISTS:
            return { 
                ...state, 
                wsLoggedIn: true,
                csRequestSuc: true, 
                csRequesting: false, 
                chattingWith: payload.staffInfo.userId 
            };
        case types.CS_CHAT_END:
            return { ...state, csRequestSuc: false, csRequestSucAndEnd: true };
        case types.CUSTOMER_QUIT_CHAT:
            return { ...state, csRequestSucAndEnd: false };
        // waiting count
        case types.CS_WAITING_COUNT:
            return { ...state, waitingCount: payload.waitingCount };
        default:
            return state;
    }
};

export default customerCsState;