import React from 'react';

import Form from '../form/Form';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';

const FIELDS = {
    email: {label: 'Login'},
    password: {label: 'Password', attributes: {type: 'password'}}
};

export default class Login extends React.Component {

    toRegistration = () => this.props.history.push(Routes.registration);

    onSubmit = fields =>
        authenticationServices.signIn(fields.email.value, fields.password.value)
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
