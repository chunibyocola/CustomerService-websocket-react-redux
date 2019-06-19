import React from 'react';
import CustomerService from '../../components/CustomerService';
import { connect } from 'react-redux';
import LogInBox from './LogInBox';

const Test = ({ customerState }) => {

    return (
        <React.Fragment>
            { customerState.loggedIn? <CustomerService />: <LogInBox /> }
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    customerState: state.customerState
});

export default connect(mapStateToProps)(Test);