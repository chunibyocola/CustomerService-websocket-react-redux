import React, { useRef } from 'react';
import { userInit } from '../../actions/userActions';
import { connect } from 'react-redux';

const LogInBox = ({ userInitDispatch }) => {

    let userIdEl = useRef(null);
    let userNameEl = useRef(null);

    const handleEnterKey = function (e) {
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            doLogIn();
        }
    };

    const doLogIn = () => {
        let userId = userIdEl.current.value;
        let userName = userNameEl.current.value;
        if (userId === '') {
            alert('please input userId');
            return;
        }
        userInitDispatch(userId, userName);
    };

    return (
        <div>
            <input onKeyPress={ handleEnterKey } ref={ userIdEl } 
                placeholder='input userId here' /><br />
            <input ref={ userNameEl } placeholder={ `don't neet to input` } /><br />
            <button onClick={ doLogIn }>Log In</button>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    userInitDispatch: (userId, userName) => dispatch(userInit(userId, userName)) 
})

export default connect(null, mapDispatchToProps)(LogInBox);