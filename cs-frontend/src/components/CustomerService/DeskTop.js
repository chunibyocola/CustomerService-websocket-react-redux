import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
    sendCustomerWsLogIn,
    sendCustomerRequestCs,
    sendCustomerCancelRequestCs 
} from '../../websocket-client/wsSend';
import { startWebSocket } from '../../websocket-client';
import ChatBox from './ChatBox';
import CsRequestBox from './CsRequestBox';

const DeskTop = ({ 
    deskTopVisible, customerState, customerCsState, requestCs, cancelRequestCs 
}) => {

    let visible = deskTopVisible ? 'visible': 'hidden';

    let {
        loggedIn
    } = customerState;

    useEffect(() => {
        function webSocketOnOpenCallBack() {
            sendCustomerWsLogIn(customerState);
        }
        if (loggedIn) {
            startWebSocket(webSocketOnOpenCallBack);
        }
    }, [loggedIn, customerState]);

    let {
        wsReadyState,
        wsLoggedIn,
        csRequesting,
        csRequestSuc,
        csRequestSucAndEnd,
        waitingCount
    } = customerCsState;

    let csLoggedInBox = (
        <div className='csRequestBox clearfix' style={{ visibility: visible }}>
            You need to log in to use customer service.
        </div>
    );
    let csWrongBox = (
        <div className='csRequestBox clearfix' style={{ visibility: visible }}>
            readyState: { wsReadyState } <br />
            csRequesting: { csRequesting } <br />
            Request worng.
        </div>
    );
    let csRequestingBox = (
        <div className='csRequestBox clearfix' style={{ visibility: visible }}>
            <div className='csRequestWaiting' >
                { `There are ${ waitingCount } customers waiting before you.` }
            </div>
            <button 
                onClick={ cancelRequestCs }
                className='csRequestBtn'
            >
                Cancel
            </button>
        </div>
    );
    let csRequestSucBox = (
        <div className='chatBox clearfix' style={{ visibility: visible }}>
            <ChatBox />
        </div>
    );
    return ( 
        csRequestSucAndEnd || csRequestSuc
        ? csRequestSucBox : csRequesting 
        ? csRequestingBox : wsLoggedIn 
        ? <CsRequestBox requestCs={ requestCs } visible={ visible } /> : loggedIn 
        ? csWrongBox : csLoggedInBox
    );
};

const mapStateToProps = state => ({
    customerState: state.customerState,
    customerCsState: state.customerCsState
});

const mapDispatchToProps = dispatch => ({
    requestCs: (questionMsg) => {
        if (questionMsg === '') {
            return;
        }
        sendCustomerRequestCs(questionMsg);
    },
    cancelRequestCs: () => sendCustomerCancelRequestCs()
});

export default connect(mapStateToProps, mapDispatchToProps)(DeskTop);