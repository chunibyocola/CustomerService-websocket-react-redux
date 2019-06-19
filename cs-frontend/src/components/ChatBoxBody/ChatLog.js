import React from 'react';
import { MsgStatus, MsgType } from '../../constants/CustomerServiceActionTypes';

const ChatLog = ({ chatLog, chattingWith, isStaff }) => {

    let direction;
    if (chattingWith === chatLog.senderId) {
        direction = 'Left';
    }
    else {
        direction = 'Right';
    }
    let textFlag;
    switch (chatLog.msgStatus) {
        case MsgStatus.SENDING: textFlag = 'Sending'; break;
        case MsgStatus.UNREAD: textFlag = 'Unread'; break;
        case MsgStatus.READ: textFlag = 'Read'; break;
        case MsgStatus.WRONG: textFlag = 'Wrong'; break;
        default: textFlag = 'Wrong';
    }
    let message = chatLog.msg;
    return (
        <div className='textArea-Item clearfix' key={ chatLog.msgId }>
            <div className={ 'textArea-' + direction + 'Item-ProfilePhoto' }>
                <img alt='profile' className='img' 
                    src='http://mall-static.sweetcola.xyz/images/head-img.jpg' />
            </div>
            <div className={ 'textArea-' + direction +'Item-Triangle' }></div>
            <div className={ 'textArea-' + direction + 'Item-MsgBox clearfix' }>
                { 
                    chatLog.msgType === MsgType.TEXT?
                    <div className={ 'textArea-' + direction + 'Item-MsgDialog' }>
                        { message }
                    </div>:
                    <div 
                        className={ 'textArea-' + direction + 'Item-MsgDialog' }
                        dangerouslySetInnerHTML={{ __html: message }}
                    ></div>
                }
                { 
                    isStaff? '': chattingWith === chatLog.senderId ? '' : 
                    <div className='textArea-Flag'>
                        <div className='textArea-TextFlag'>
                            { textFlag }
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ChatLog;