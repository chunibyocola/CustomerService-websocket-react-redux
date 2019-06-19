import { combineReducers } from 'redux';
import customerCsState from './customerCsState';
import customerState from './customerState';
import staffCsState from './staffCsState';
import staffState from './staffState';
import chatState from './chatState';

export default combineReducers({
    customerState,
    customerCsState,
    staffCsState,
    staffState,
    chatState
});