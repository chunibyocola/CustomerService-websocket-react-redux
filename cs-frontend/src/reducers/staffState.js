import * as types from '../constants/CustomerServiceActionTypes';

const initState = {
    userName: '',
    userId: '',
    loggedIn: false
};

const staffState = (state = initState, action) => {

    let { type, payload } = action;

    switch (type) {
        case types.STAFF_WS_LOG_IN:
            return { ...state, loggedIn: true };
        case types.REQUEST_CS_SUCCESS:
            return { ...payload.staffInfo };
        case types.CHAT_ALREADY_EXISTS:
            return { ...payload.staffInfo };
        default:
            return state;
    }
};

export default staffState;