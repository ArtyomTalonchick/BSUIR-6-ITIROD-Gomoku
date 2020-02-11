import React from 'react';

import './Header.scss';
import HeaderButton from './button/HeaderButton';

export default class Header extends React.Component {

    render() {
        return (
            <div className='header-container'>
                <div className='buttons-container'>
                    <HeaderButton pressed={true}>
                        Search
                    </HeaderButton>
                    <HeaderButton>
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
