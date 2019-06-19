import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import ChatLog from './ChatLog';
import './style.css';

const ChatBoxBody = ({ chatState, chattingWith, isStaff, csRequestSucAndEnd }) => {

    let chatBodyEl = useRef(null);

    useEffect(() => {
        chatBodyEl.current.scrollTop = chatBodyEl.current.scrollHeight;
    });

    return (
        <div className='chatting-Body'>
            <div 
                className='chatting-Body-TextArea'
                ref={ chatBodyEl } 
                style={ isStaff? { height: '400px' }: {} }
            >
                { 
                    chatState[chattingWith].chatLogs.map((chatLog, index) => {
                        return <ChatLog 
                            chatLog={ chatLog } 
                            chattingWith={ chattingWith } 
                            isStaff={ isStaff }
                            key={ index }
                        />;
                    })
                }
                {
                    isStaff? '': csRequestSucAndEnd ?
                    <div className='textArea-CenterItem'>
                        <div className='textArea-Item clearfix'>
                            <div className='textArea-CenterItem-Notice'>
                                Chat End
                            </div>
                        </div>
                    </div> : ''
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    chatState: state.chatState
});

export default connect(mapStateToProps)(ChatBoxBody);