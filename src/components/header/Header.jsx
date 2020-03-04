import React from 'react';

import './Header.scss';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';
import MainLabel from '../../images/MainLabel.png'
import {Link} from "../router/router";

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            movingBar: false
        }
    }

    componentDidMount() {
        window.addEventListener('click', this.onWindowClick);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick);
    }

    onWindowClick = event => {
        if (event.target.id === 'bar-icon') {
            this.setState({movingBar: true});
        } else {
            this.setState({movingBar: false});
        }
    };

    signOut = () => authenticationServices.signOut();

    buttons =
        <>
            <Link className='header-button-container' to={Routes.search}>
                Search
            </Link>
            <Link className='header-button-container' to={Routes.profile}>
                My Profile
            </Link>
        </>;

    render() {
        return (
            <div className='header-container'>
                <div className='main-row'>
                    <img src={MainLabel} alt=''/>
                    <i className='fa fa-bars' id='bar-icon'/>
                    <div className='buttons-container'>
                        {this.buttons}
                    </div>
                    <i className='fa fa-sign-out' onClick={this.signOut}/>
                </div>
                <div className={`moving-bar${this.state.movingBar ? '' : ' displayNone'}`}>
                    {this.buttons}
                </div>
            </div>
        );
    }
}
