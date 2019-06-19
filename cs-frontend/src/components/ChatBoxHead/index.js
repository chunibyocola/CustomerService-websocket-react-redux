import React from 'react';
import { connect } from 'react-redux';
import { sendStaffCloseChat } from '../../websocket-client/wsSend';
import { customerQuitChat } from '../../actions/customerServiceActions';
import './style.css';

const ChatBoxHead = ({ 
    csRequestSucAndEnd, chatBoxHeadtitle, isStaff, chattingWith, quitChat
}) => {

    const drag = (e) => {
        let ele = document.getElementsByClassName('chatBox')[0];
        let originX = e.clientX, originY = e.clientY;
        let right = window.innerWidth - ele.offsetLeft - ele.offsetWidth;
        let top = ele.offsetTop;
        document.onselectstart = () => { return false; }
        document.onmousemove = function (ev) {
            let nowX = ev.clientX, nowY = ev.clientY;
            let diffX = originX - nowX, diffY = originY - nowY;
            let nowRight = right + diffX, nowTop = top - diffY;
            ele.style.right = `${nowRight}px`;
            ele.style.top = `${nowTop}px`;
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            document.onselectstart = () => { return true; }
        };
    }

    return (
        <div className='chatting-Head'  onMouseDown={ isStaff? null: drag }>
            <div className='chatting-Head-Setting'>
                <div className='chatting-Head-Setting-Inner'>
                    { 
                        isStaff?  
                        <button 
                            onClick={ () => sendStaffCloseChat(chattingWith) }
                            className='chatting-Head-Quit-Btn'
                        >
                            End Service
                        </button>: 
                        csRequestSucAndEnd ?
                        <button 
                            onClick={ () => quitChat() }
                            className='chatting-Head-Quit-Btn'
                        >
                            Quit
                        </button> : ''
                    }
                </div>
            </div>
            <div className='chatting-Head-Title'>{ chatBoxHeadtitle }</div>
        </div>
    );
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    quitChat: () => dispatch(customerQuitChat())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoxHead);