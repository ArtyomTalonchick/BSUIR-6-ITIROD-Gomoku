import React from 'react';

import './Profile.scss';

export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {
                id: 1,
                name: 'UserName',
                img: 'https://avatars.mds.yandex.net/get-pdb/1705881/f8db19d4-c10e-4d27-83a3-db53d4f52430/s375'
            }
        }
    }

    render() {
        const user = this.state.user;
        return (
            <div className='profile-container'>
                <div className='image-block'>
                    <img src={user.img}/>
                    <button>
                        Change
                    </button>
                </div>
                <div className='info-block'>
                    <label>Name
                        <input placeholder='Name...'/>
                    </label>
                    <label>Field1
                        <input placeholder='Field1...'/>
                    </label>
                    <label>Field2Long
                        <input placeholder='Field2Long...'/>
                    </label>
                    <button>
                        Save
                    </button>
                </div>
            </div>
        );
    }
}
