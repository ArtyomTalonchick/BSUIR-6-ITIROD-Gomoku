import React from 'react';

import './AuthenticationBlank.scss';

export default class AuthenticationBlank extends React.Component {

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
