import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import './App.scss';
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
                <BrowserRouter>
                    {currentUser &&
                    <>
                        <Header/>
                        <Switch>
                            <Route path={Routes.profile} component={Profile}/>
                            <Route path={Routes.search} component={Search}/>
                            <Route path={Routes.game} component={Game}/>
                            <Redirect to={Routes.profile}/>
                        </Switch>
                        <GameAlert/>
                    </>
                    }
                    {currentUser === null &&
                    <Switch>
                        <Route path={Routes.login} component={Login}/>
                        <Route path={Routes.registration} component={Registration}/>
                        <Redirect to={Routes.login}/>
                    </Switch>
                    }
                </BrowserRouter>
            </div>
        );
    }
}

App.contextType = AuthContext;
