import * as types from '../constants/CustomerServiceActionTypes';

const initState = {
    wsReadyState: 0,
    wsLoggedIn: false,
    chattingWith: '',
    waitingCount: 0
};

const staffCsState = (state = initState, action) => {

    let { type, payload } = action;
    switch(type) { // readyState: WebSocket.readyState
        // Common
        case types.WEB_SOCKET_READY_STATE_CHANGE:
            return { ...state, wsReadyState: action.readyState };
        // Staff
        case types.STAFF_WS_LOG_IN:
            return { ...state, wsLoggedIn: payload.status };
        case types.STAFF_CHATTING_WITH:
            return { ...state, chattingWith: payload.customerId };
        case types.STAFF_CLOSE_CHAT_SUCCESS:
            return { ...state, chattingWith: '' }
        // waiting count
        case types.CS_WAITING_COUNT:
            return { ...state, waitingCount: payload.waitingCount };
        default:
            return state;
    }
};

export default staffCsState;