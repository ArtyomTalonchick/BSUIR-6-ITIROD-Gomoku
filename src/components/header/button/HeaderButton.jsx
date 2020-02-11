import React from 'react';

import './HeaderButton.scss';

export default class HeaderButton extends React.Component {

    getClassName = () => 'header-button-container' + (this.props.pressed ? ' pressed' : '');

    render() {
        return (
            <button className={this.getClassName()}>
                {this.props.children}
            </button>
        );
    }
}
