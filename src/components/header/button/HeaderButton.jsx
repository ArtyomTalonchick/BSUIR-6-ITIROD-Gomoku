import React from 'react';
import {withRouter, Link} from 'react-router-dom';

import './HeaderButton.scss';
import RouteHelper from '../../../helpers/RouteHelper';

class HeaderButton extends React.Component {

    getClassName = () => {
        const pressed = RouteHelper.compare(this.props.route, this.props.location.pathname);
        return 'header-button-container' + (pressed ? ' pressed' : '');
    };


    render() {
        return (
            <Link
                className={this.getClassName()}
                to={RouteHelper.build(this.props.route)}
            >
                {this.props.children}
            </Link>
        );
    }
}

export default withRouter(HeaderButton)
