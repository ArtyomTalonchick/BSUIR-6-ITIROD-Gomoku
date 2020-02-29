import React from 'react';

import './Search.scss';
import SearchHeader from './header/SearchHeader';
import SearchPreview from './preview/SearchPreview';
import userServices from '../../services/userServices';
import Loader from '../loader/Loader';
import GamePromise from '../gamePromise/GamePromise';
import {AuthContext} from '../AuthProvider';
import userStatuses from '../../constants/userStatuses';

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
            searchValue: '',
            selectedOpponent: undefined
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        this.detachUsersListener = userServices.onAllUsersUpdate(users => this.setState({loading: false, users}));
    }

    componentWillUnmount() {
        this.detachUsersListener && this.detachUsersListener();
    }

    onSearch = value => this.setState({searchValue: value});

    getUsersFromSearch = () =>
        this.state.users.filter(u => u.name.toUpperCase().includes(this.state.searchValue.toUpperCase()));

    onChallenge = user => {
        if (this.challengePossible(user)) {
            this.setState({selectedOpponent: user});
        }
    };


    onCancelChallenge = () => this.setState({selectedOpponent: undefined});

    challengePossible = user => user.id !== this.context.currentUser.id && user.status === userStatuses.ONLINE;

    render() {
        return (
            <div className='search-container blank'>
                <SearchHeader onSubmit={this.onSearch}/>
                <hr/>
                {this.state.loading && <Loader/>}
                {this.getUsersFromSearch().map(user => (
                    <SearchPreview
                        key={user.id}
                        user={user}
                        onChallenge={() => this.onChallenge(user)}
                        challengePosseble={this.challengePossible(user)}
                    />
                ))}
                <GamePromise opponent={this.state.selectedOpponent} onCancel={this.onCancelChallenge}/>
            </div>
        );
    }
}

Search.contextType = AuthContext;
