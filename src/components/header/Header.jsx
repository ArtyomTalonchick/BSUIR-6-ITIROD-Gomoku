import React from 'react';

import './Header.scss';
import {Routes} from '../../constants/routes';
import HeaderButton from './button/HeaderButton';
import authenticationServices from '../../services/authenticationServices';
import MainLabel from '../../images/MainLabel.png'

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            movingBar: false
        }
    }

    signOut = () => authenticationServices.signOut();

    showMovingBar = () => {
        this.setState({movingBar: !this.state.movingBar});
    };

    buttons =
        <>
            <HeaderButton route={Routes.search}>
                Search
            </HeaderButton>
            <HeaderButton route={Routes.profile}>
                My Profile
            </HeaderButton>
        </>;

    render() {
        return (
            <div className='header-container'>
                <div className='main-row'>
                    <img src={MainLabel} alt=''/>
                    <i className='fa fa-bars' onClick={this.showMovingBar}/>
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
