import React from 'react';

import './Profile.scss';
import Form from '../form/Form';

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

    onSubmit = fields => {
        console.log(fields);
    };

    render() {
        const user = this.state.user;
        const fields = {
            name: {
                label: 'Name',
                value: user.name
            },
            field: {
                label: 'Field Long Name'
            },
        };
        return (
            <div className='profile-container'>
                <div className='image-block'>
                    <img src={user.img}/>
                    <button>
                        Change
                    </button>
                </div>
                <Form
                    fields={fields}
                    onSubmit={this.onSubmit}
                    submitText='Save'
                />
            </div>
        );
    }
}
