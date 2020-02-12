import React from 'react';
import {withRouter, Link} from 'react-router-dom';

import './HeaderButton.scss';

class HeaderButton extends React.Component {

    getClassName = () => {
        const pressed = this.props.location.pathname === this.props.route;
        return 'header-button-container' + (pressed ? ' pressed' : '');
    };


    render() {
        return (
            <Link
                className={this.getClassName()}
                to={this.props.route || '#'}
            >
                {this.props.children}
            </Link>
        );
    }
}

export default withRouter(HeaderButton)
