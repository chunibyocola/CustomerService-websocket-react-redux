import * as types from '../constants/UserActionTypes';

export const userInit = (userId, userName) => {
    return {
        type: types.USER_INIT,
        payload: {
            userId, userName
        }
    }
};