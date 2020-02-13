import React from 'react';

import './Header.scss';
import {Routes} from '../../constants/routes';
import HeaderButton from './button/HeaderButton';
import authenticationServices from '../../services/authenticationServices';

export default class Header extends React.Component {

    signOut = () => authenticationServices.signOut();

    render() {
        return (
            <div className='header-container'>
                <div className='buttons-container'>
                    <HeaderButton route={Routes.search}>
                        Search
                    </HeaderButton>
                    <HeaderButton route={Routes.profile}>
                        My Profile
                    </HeaderButton>
                    <i className='fa fa-sign-out' onClick={this.signOut}/>
                </div>
            </div>
        );
    }
}
