import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.scss';
import {Routes} from '../constants/roures';
import Header from './header/Header';
import Profile from './profile/Profile';
import Search from './search/Search';
import Game from './game/Game';

export default class App extends React.Component {

    render() {
        return (
            <div className='app-container'>
                <BrowserRouter>
                    <Header/>
                    <Switch>
                        <Route path={Routes.profile} component={Profile}/>
                        <Route path={Routes.search} component={Search}/>
                        <Route path={Routes.game} component={Game}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}
