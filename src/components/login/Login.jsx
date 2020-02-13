import React from 'react';

import Form from '../form/Form';
import {Routes} from '../../constants/roures';
import firebaseApp from '../../services/firebaseApp';

const FIELDS = {
    email: {label: 'Login'},
    password: {label: 'Password', attributes: {type: 'password'}}
};

export default class Login extends React.Component {

    toRegistration = () => this.props.history.push(Routes.registration);

    onSubmit = fields =>
        firebaseApp
            .auth()
            .signInWithEmailAndPassword(fields.email.value, fields.password.value)
            .then(() => this.props.history.push(Routes.profile))
            .catch(error => alert(error));

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
