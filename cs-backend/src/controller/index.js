const types = require('../constants/CustomerServiceActionTypes');
const actions = require('./actions');

const msgDispatcher = (msg, connection) => {

    msg = JSON.parse(msg);
    let { type, payload } = msg;
    switch (type) {
        case types.CUSTOMER_WS_LOG_IN:
            actions.customerWsLogIn(payload, connection);
            break;
        case types.CUSTOMER_REQUEST_CS:
            actions.customerRequestCs(payload, connection);
            break;
        case types.CUSTOMER_CANCEL_REQUEST_CS:
            actions.customerCancelRequestCs(payload, connection);
            break;
        case types.STAFF_WS_LOG_IN:
            actions.staffWsLogIn(payload, connection);
            break;
        case types.STAFF_ACCEPT_CUSTOMER:
            actions.staffAcceptCustomer(payload, connection);
            break;
        case types.MSG_GET_READ:
            actions.msgGetRead(payload, connection);
            break;
        case types.CUSTOMER_SEND_MSG:
            actions.customerSendMsg(payload, connection);
            break;
        case types.STAFF_SEND_MSG:
            actions.staffSendMsg(payload, connection);
            break;
        case types.STAFF_CLOSE_CHAT:
            actions.staffCloseChat(payload, connection);
            break;
        case types.FILE_UPLOAD_HEAD:
            actions.fileUploadHead(payload, connection);
            break;
        case types.FILE_UPLOAD_FRAGMENT:
            actions.fileUploadFragment(payload, connection);
            break;
        case types.FILE_UPLOAD_END:
            actions.fileUploadEnd(payload, connection);
            break;
        default:
            console.log('Unknow');
            break;
    }
};

module.exports = msgDispatcher;