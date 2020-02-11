import React from 'react';

import './Header.scss';
import {Routes} from '../../constants/roures';
import HeaderButton from './button/HeaderButton';

export default class Header extends React.Component {

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
                    <HeaderButton>
                        Sign out
                    </HeaderButton>

                </div>
            </div>
        );
    }
}
