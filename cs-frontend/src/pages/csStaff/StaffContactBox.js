import React from 'react';
import { connect } from 'react-redux';
import { readMsg, staffChattingWith } from '../../actions/customerServiceActions';
import { sendMsgGetRead } from '../../websocket-client/wsSend';

const StaffContactBox = ({ staffCsState, chatState, chatWith }) => {

    let { chattingWith } = staffCsState;

    return (
        <div className='staffContactBox'>
            { 
                Object.keys(chatState).map((key) => 
                    <div 
                        key={ key }
                        className="contactBox-Item"
                        onClick={ () => 
                            chatWith(key, chatState[key].unreadCount, chattingWith) 
                        }
                    >
                        { chatState[key].customerInfo.userName }
                        
                        { 
                            chatState[key].unreadCount === 0 
                            ? '' 
                            : <div className="sign-new-msg">{ chatState[key].unreadCount.toString() }</div> 
                        }
                        
                    </div>
                ) 
            }
        </div>
    );
};

const mapStateToProps = state => ({
    chatState: state.chatState,
    staffCsState: state.staffCsState
});

const mapDispatchToProps = dispatch => ({
    chatWith: (customerId, unreadCount, chattingWith) => { 
        if (chattingWith === customerId)
            return;
        if (unreadCount !== 0) {
            sendMsgGetRead(customerId);
            dispatch(readMsg(customerId));
        }
        dispatch(staffChattingWith(customerId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StaffContactBox)