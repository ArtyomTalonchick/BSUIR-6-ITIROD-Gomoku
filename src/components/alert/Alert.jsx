import React from 'react';

import './Alert.scss';

export default class Alert extends React.Component {

    render() {
        return (
            <div className='alert-container'>
                <div className={`alert ${this.props.variant || ''}`}>
                    <span className='title'>
                        {this.props.title}
                    </span>

                    <hr/>

                    <span className='body'>
                        {this.props.body}
                    </span>

                    <div className='controls'>
                        {this.props.controls}
                    </div>
                </div>
            </div>
        );
    }
}
