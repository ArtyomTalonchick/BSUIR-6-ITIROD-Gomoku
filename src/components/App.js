import React from 'react';

import './App.scss';
import Router, {Redirect} from './router/router';
import {Routes} from '../constants/routes';
import Header from './header/Header';
import Profile from './profile/Profile';
import Search from './search/Search';
import Game from './game/Game';
import Login from './login/Login';
import Registration from './registration/Registration';
import {AuthContext} from './AuthProvider';
import GameAlert from './gameAlert/GameAlert';

export default class App extends React.Component {

    render() {
        const {currentUser} = this.context;
        return (
            <div className='app-container'>
                {currentUser &&
                <>
                    <Header/>
                    <Router path={Routes.profile} component={Profile}/>
                    <Router path={Routes.search} component={Search}/>
                    <Router path={Routes.game} component={Game}/>
                    <Redirect to={Routes.profile}/>
                    <GameAlert/>
                </>
                }
                {currentUser === null &&
                <>
                    <Router path={Routes.login} component={Login}/>
                    <Router path={Routes.registration} component={Registration}/>
                    <Redirect to={Routes.login}/>
                </>
                }
            </div>
        );
    }
}

App.contextType = AuthContext;
