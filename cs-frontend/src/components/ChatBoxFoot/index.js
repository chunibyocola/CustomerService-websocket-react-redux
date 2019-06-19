import React, { useRef } from 'react';
import { connect } from 'react-redux';
import './style.css';
import { customerSendMsg, staffSendMsg } from '../../actions/customerServiceActions';
import { addFileUploadItem } from '../../utils/fileUpload';
import { MsgType } from '../../constants/CustomerServiceActionTypes';

const ChatBoxFoot = ({ 
    csRequestSucAndEnd, chattingWith, chatState, isStaff, ownId,
    dispatchStaffSendMsg, dispatchCustomerSendMsg
}) => {

    let textareaEl = useRef(null);

    const handleEnterKey = function (e) {
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            sendMsg();
        }
    };

    const uploadImage = (e) => {
        if (e.target.value === '') {
            return;
        }
        addFileUploadItem(e.target.files[0], chattingWith, ownId, MsgType.IMAGE);
        e.target.value = '';
    }

    const sendMsg = () => {

        if (!isStaff && csRequestSucAndEnd) {
            return;
        }
        let textValue = textareaEl.current.value;
        if (textValue === '') {
            return;
        }
        if (isStaff) {
            dispatchStaffSendMsg(
                chattingWith, textValue, 
                chatState[chattingWith].msgCount, ownId
            );
        }
        else {
            dispatchCustomerSendMsg(
                chattingWith, textValue,
                chatState[chattingWith].msgCount, ownId
            );
        }
        textareaEl.current.value = '';
        textareaEl.current.focus();
    };
    
    return (
        <div className='chatting-Footer'>
            <div className='chatting-Footer-Upload'>
                <ul className='chatting-Footer-UploadMenu' >
                    <li>
                        <span 
                            className='chatting-Footer-UploadItem'
                            onClick={ e =>  e.target.nextSibling.click()  }
                        >Send Image</span><input 
                            style={{ 'display': 'none' }}
                            type='file' 
                            accept='image/x-png,image/gif,image/jpeg,image/bmp'
                            onChange={ uploadImage }
                        />
                    </li>
                </ul>
            </div>
            <div className='chatting-Footer-SendBox'>
                <textarea 
                    onKeyPress={ handleEnterKey }
                    ref={ textareaEl } 
                    className='sendBox-TextArea'
                    placeholder='Press Enter to Send Message.'>
                </textarea>
            </div>
            <button
                id='chat-send-btn'
                className='cs-send-btn'
                onClick={ sendMsg }
            >
                    Sned Message
            </button>
        </div>
    );
};

const mapStateToProps = state => ({
    chatState: state.chatState
});

const mapDispatchToProps = dispatch => ({
    dispatchStaffSendMsg: (targetId, msg, msgId, senderId) => dispatch(staffSendMsg(
        targetId, msg, msgId, senderId
    )),
    dispatchCustomerSendMsg: (targetId, msg, msgId, senderId) => dispatch(customerSendMsg(
        targetId, msg, msgId, senderId
    ))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxFoot);