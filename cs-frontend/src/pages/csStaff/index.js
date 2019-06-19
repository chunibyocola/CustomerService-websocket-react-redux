import React from 'react';
import { connect } from 'react-redux';
import StaffLogInBox from './StaffLogInBox';
import StaffChatBox from './StaffChatBox';
import './style.css';


const CsStaff = ({ staffState }) => {

    let { loggedIn } = staffState;

    return (
        <React.Fragment>
            { loggedIn? <StaffChatBox />: <StaffLogInBox/> }
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    staffState: state.staffState
});

export default connect(mapStateToProps)(CsStaff);