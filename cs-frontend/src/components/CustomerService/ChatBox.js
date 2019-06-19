import React from 'react';
import { connect } from 'react-redux';
import ChatBoxHead from '../ChatBoxHead';
import ChatBoxBody from '../ChatBoxBody';
import ChatBoxFoot from '../ChatBoxFoot';

const ChatBox = ({ customerCsState, customerState }) => {
    
    let { csRequestSucAndEnd, chattingWith } = customerCsState;
    let { userId: ownId } = customerState;

    return (
        <div className='msgBox'>
            <ChatBoxHead 
                csRequestSucAndEnd={ csRequestSucAndEnd } 
                chatBoxHeadtitle={ `Staff ID: ${ chattingWith }` } 
            />
            <ChatBoxBody 
                chattingWith={ chattingWith }
                csRequestSucAndEnd={ csRequestSucAndEnd }
            />
            <ChatBoxFoot 
                chattingWith={ chattingWith }
                csRequestSucAndEnd={ csRequestSucAndEnd }
                ownId={ ownId }
            />
        </div>
    );
};

const mapStateToProps = state => ({
    customerCsState: state.customerCsState,
    customerState: state.customerState
});

export default connect(mapStateToProps)(ChatBox);