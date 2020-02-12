import React from 'react';

import Form from '../form/Form';
import {Routes} from '../../constants/roures';

const FIELDS = {
    login: {label: 'Login'},
    password: {label: 'Password'}
};

export default class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    toRegistration = () => this.props.history.push(Routes.registration);

    onSubmit = fields => {
        console.log(fields);
    };

    render() {
        return (
            <Form
                title='Login'
                fields={FIELDS}
                onSubmit={this.onSubmit}
                additionalControl={(
                    <button className='secondary' onClick={this.toRegistration}>
                        To Registration
                    </button>
                )}
            />
        );
    }
}
