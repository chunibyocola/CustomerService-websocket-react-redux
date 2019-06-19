import React, { useRef, useEffect } from 'react';

const CsRequestBox = ({ requestCs, visible }) => {

    const textareaEl = useRef(null);

    const handleEnterKey = function (e) {
        if (e.nativeEvent.keyCode === 13) {
            e.preventDefault();
            requestCs(textareaEl.current.value);
        }
    };

    useEffect(() => {
        if (visible === 'visible')
            textareaEl.current.focus();
    }, [visible]);

    return (
        <div className='csRequestBox clearfix' style={{ visibility: visible }}>
            <textarea 
                onKeyPress={ handleEnterKey }
                className='csRequestText' 
                ref={ textareaEl } 
                placeholder='Input question here. Press Enter to call.' 
            />
            <button 
                onClick={ () => requestCs(textareaEl.current.value) }
                className='csRequestBtn'
            >
                Call
            </button>
        </div>
    );
};

export default CsRequestBox;