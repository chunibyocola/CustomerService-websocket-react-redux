import * as types from '../constants/UserActionTypes';

const initState = {
    userName: '',
    userId: '',
    loggedIn: false
};

const customerState = (state = initState, action) => {

    let { type, payload } = action;

    switch (type) {
        case types.USER_INIT:
            return { ...payload, loggedIn: true };
        default:
            return state;
    }
};

export default customerState;