import React from 'react';

import './Search.scss';
import SearchHeader from './header/SearchHeader';
import SearchPreview from './preview/SearchPreview';

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        // TODO
        this.state = {
            users: [
                {
                    id: 1,
                    name: 'UserName',
                    img: 'https://avatars.mds.yandex.net/get-pdb/1705881/f8db19d4-c10e-4d27-83a3-db53d4f52430/s375'
                },
                {
                    id: 2,
                    name: 'User 2',
                    img: 'https://www.meme-arsenal.com/memes/7bdea6754f999b50e9577596f09197fb.jpg'
                }
            ]
        }
    }

    // TODO
    onSearch = value => console.log(value);

    // TODO
    onChallenge = user => console.log('onUserClick: ', user);


    render() {
        return (
            <div className='search-container'>
                <SearchHeader onSubmit={this.onSearch}/>
                <hr/>
                {this.state.users.map(user => (
                    <SearchPreview key={user.id} user={user} onChallenge={() => this.onChallenge(user)}/>
                ))}
            </div>
        );
    }
}
