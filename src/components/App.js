import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './App.scss';
import {Routes} from '../constants/roures';
import Header from './header/Header';
import PageBlank from './pageBlank/PageBlank';
import Profile from './profile/Profile';
import Search from './search/Search';
import Game from './game/Game';
import AuthenticationBlank from './authenticationBlank/AuthenticationBlank';
import Login from './login/Login';
import Registration from './registration/Registration';

export default class App extends React.Component {

    render() {
        const user = true;
        return (
            <div className='app-container'>
                <BrowserRouter>
                    {user
                        ? (
                            <>
                                <Header/>
                                <PageBlank>
                                    <Switch>
                                        <Route path={Routes.profile} component={Profile}/>
                                        <Route path={Routes.search} component={Search}/>
                                        <Route path={Routes.game} component={Game}/>
                                    </Switch>
                                </PageBlank>
                            </>
                        )
                        : (
                            <Switch>
                                <AuthenticationBlank>
                                    <Route path={Routes.login} component={Login}/>
                                    <Route path={Routes.registration} component={Registration}/>
                                </AuthenticationBlank>
                            </Switch>
                        )

                    }

                </BrowserRouter>
            </div>
        );
    }
}
