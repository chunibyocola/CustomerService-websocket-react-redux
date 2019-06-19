import React, { useRef } from 'react';
import { startWebSocket } from '../../websocket-client'
import { sendStaffWsLogIn } from '../../websocket-client/wsSend';

const StaffLogInBox = () => {

    let userIdEl = useRef(null);
    let userPwEl = useRef(null);

    const handleEnterKey = function (e) {
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            doLogIn();
        }
    };

    const doLogIn = () => {
        const webSocketOnOpenCallBack = () => {
            sendStaffWsLogIn(userIdEl.current.value, userPwEl.current.value);
        };
        startWebSocket(webSocketOnOpenCallBack);
    };

    return (
        <div>
            <input onKeyPress={ handleEnterKey } ref={ userIdEl } 
                placeholder='input userId here' /><br />
            <input ref={ userPwEl } placeholder={ `don't need to input` } /><br />
            <button onClick={ doLogIn }>Log In</button>
        </div>
    );
};

export default StaffLogInBox;