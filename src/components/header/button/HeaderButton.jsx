import React from 'react';
import {withRouter} from 'react-router-dom';

import './HeaderButton.scss';

class HeaderButton extends React.Component {

    getClassName = () => {
        const pressed = this.props.location.pathname === this.props.route;
        return 'header-button-container' + (pressed ? ' pressed' : '');
    };

    onClick = () => this.props.history.push(this.props.route);

    render() {
        return (
            <button
                className={this.getClassName()}
                onClick={this.onClick}
            >
                {this.props.children}
            </button>
        );
    }
}

export default withRouter(HeaderButton)
