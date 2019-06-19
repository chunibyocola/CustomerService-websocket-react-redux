import React from 'react';
import { connect } from 'react-redux';
import { sendStaffAcceptCustomer } from '../../websocket-client/wsSend';
import StaffContactBox from './StaffContactBox';
import StaffMsgBox from './StaffMsgBox';

const StaffChatBox = ({ staffCsState }) => {

    let { chattingWith, waitingCount } = staffCsState;

    return (
        <div id='content'>
            <div style={{ width: '700px', margin: '0 auto' }}>
                <div className="staffChatBox clearfix">
                    <span className='waitingCount-text'>
                        { `There are ${ waitingCount } customer waiting...` }
                    </span>
                    <button 
                        onClick={ sendStaffAcceptCustomer }
                        className="cs-send-btn" 
                        style={{ margin: '10px' }}
                        id="getCustomerBtn"
                    >
                            Accept Customer
                    </button>
                    <button 
                        className="cs-send-btn" 
                        style={{ margin: '10px' }} 
                        id="logoutBtn"
                        onClick={ () => alert('Press F5 to Quit') }
                    >
                            Quit
                    </button><br/> 
                </div>
                <StaffContactBox />
                {
                    chattingWith === ''? '': <StaffMsgBox />
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    staffCsState: state.staffCsState
});

export default connect(mapStateToProps)(StaffChatBox);