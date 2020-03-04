import React from 'react';

import './HeaderButton.scss';
import {Link} from '../../router/router';

export default class HeaderButton extends React.Component {

    getClassName = () => {
        const pressed = this.props.route === location.pathname;
        return 'header-button-container' + (pressed ? ' pressed' : '');
    };


    render() {
        return (
            <Link
                className={this.getClassName()}
                to={this.props.route}
            >
                {this.props.children}
            </Link>
        );
    }
}
