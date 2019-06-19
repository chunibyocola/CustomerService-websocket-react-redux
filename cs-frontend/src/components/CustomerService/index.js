import React, { useState } from 'react';
import { connect } from 'react-redux';
import DeskTop from './DeskTop';
import './style.css';

const CustomerService = ({ customerCsState }) => {

    let [deskTopVisible, setDeskTopVisible] = useState(false);
    let { csRequestSuc } = customerCsState;

    return (
        <div className='customerService'>
            <div className='cs-showBtn'  
                onClick={ () => setDeskTopVisible(!deskTopVisible) }
            >
                { deskTopVisible ? 'Hide': 'C S' }
                { csRequestSuc? <div className='deskTop-signal'></div>: '' }
            </div>
            <DeskTop deskTopVisible={ deskTopVisible } />
        </div>
    );
};

const mapStateToProps = state => ({
    customerCsState: state.customerCsState
})

export default connect(mapStateToProps)(CustomerService);