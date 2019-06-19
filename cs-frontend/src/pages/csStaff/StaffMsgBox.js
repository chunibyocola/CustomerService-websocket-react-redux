import React from 'react';
import { connect } from 'react-redux';
import ChatBoxHead from '../../components/ChatBoxHead';
import ChatBoxBody from '../../components/ChatBoxBody';
import ChatBoxFoot from '../../components/ChatBoxFoot';

const StaffMsgBox = ({ staffCsState , staffState}) => {

    let { chattingWith } = staffCsState;
    let { userId: ownId } = staffState;

    return (
        <div className='staffMsgBox'>
            <ChatBoxHead 
                isStaff={ true } 
                chatBoxHeadtitle={ `Costomer ID: ${ chattingWith }` } 
                chattingWith={ chattingWith }
            />
            <ChatBoxBody 
                chattingWith={ chattingWith }
                isStaff={ true }
            />
            <ChatBoxFoot 
                chattingWith={ chattingWith }
                isStaff={ true }
                ownId={ ownId }
            />
        </div>
    );
}

const mapStateToProps = state => ({
    staffCsState: state.staffCsState,
    staffState: state.staffState
});

export default connect(mapStateToProps)(StaffMsgBox)