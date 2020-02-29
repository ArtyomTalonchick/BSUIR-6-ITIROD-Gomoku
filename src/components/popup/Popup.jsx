import React from 'react';

import './Popup.scss';

export default class Popup extends React.Component {

    render() {
        return (
            <div className='authentication-blank-container'>
                <div className='form blank'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
