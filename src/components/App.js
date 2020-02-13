import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import './App.scss';
import {Routes} from '../constants/routes';
import Header from './header/Header';
import PageBlank from './pageBlank/PageBlank';
import Profile from './profile/Profile';
import Search from './search/Search';
import Game from './game/Game';
import AuthenticationBlank from './authenticationBlank/AuthenticationBlank';
import Login from './login/Login';
import Registration from './registration/Registration';
import {AuthContext} from './AuthProvider';

export default class App extends React.Component {

    render() {
        const {currentUser} = this.context;
        return (
            <div className='app-container'>
                <BrowserRouter>
                    {currentUser &&
                    <>
                        <Header/>
                        <PageBlank>
                            <Switch>
                                <Route path={Routes.profile} component={Profile}/>
                                <Route path={Routes.search} component={Search}/>
                                <Route path={Routes.game} component={Game}/>
                                <Redirect to={Routes.profile}/>
                            </Switch>
                        </PageBlank>
                    </>
                    }
                    {currentUser === null &&
                        <AuthenticationBlank>
                            <Switch>
                                <Route path={Routes.login} component={Login}/>
                                <Route path={Routes.registration} component={Registration}/>
                                <Redirect to={Routes.login}/>
                            </Switch>
                        </AuthenticationBlank>
                    }
                </BrowserRouter>
            </div>
        );
    }
}

App.contextType = AuthContext;
