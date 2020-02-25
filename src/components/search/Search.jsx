import React from 'react';

import './Search.scss';
import SearchHeader from './header/SearchHeader';
import SearchPreview from './preview/SearchPreview';
import userServices from '../../services/userServices';
import Loader from '../loader/Loader';
import GamePromise from '../gamePromise/GamePromise';

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
        userServices.getAll()
            .then(users => this.setState({loading: false, users}));
    }

    onSearch = value => this.setState({searchValue: value});

    getUsersFromSearch = () =>
        this.state.users.filter(u => u.name.toUpperCase().includes(this.state.searchValue.toUpperCase()));

    onChallenge = user => this.setState({selectedOpponent: user});

    render() {
        return (
            <div className='search-container'>
                <SearchHeader onSubmit={this.onSearch}/>
                <hr/>
                {this.state.loading && <Loader/>}
                {this.getUsersFromSearch().map(user => (
                    <SearchPreview key={user.id} user={user} onChallenge={() => this.onChallenge(user)}/>
                ))}
                <GamePromise opponent={this.state.selectedOpponent} onCancel={this.onChallenge}/>
            </div>
        );
    }
}
