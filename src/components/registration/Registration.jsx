import React from 'react';
import {Link} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';
import Loader from "../loader/Loader";

const FIELDS = {
    name: {label: 'Name'},
    email: {label: 'Email'},
    password: {label: 'Password', attributes: {type: 'password'}},
    confirmPassword: {label: 'Confirm Password', attributes: {type: 'password'}}
};

export default class Registration extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: JSON.parse(JSON.stringify(FIELDS)),
            error: ''
        }
    }

    onSubmit = fields => {
        if (!fields.name.value || !fields.email.value || !fields.password.value) {
            this.setState({error: 'All fields must be filled'});
            return;
        }
        if (fields.password.value !== fields.confirmPassword.value) {
            this.setState({error: 'Passwords do not match'});
            return;
        }
        this.setState({fields: JSON.parse(JSON.stringify(fields)), loading: true});
        authenticationServices.signUp(fields.name.value, fields.email.value, fields.password.value)
            .catch(error => this.setState({loading: false, error: error.message}));
    };

    render() {
        return this.state.loading ?
            <Loader/>
            :
            <Form
                error={this.state.error}
                title='Registration'
                fields={this.state.fields}
                onSubmit={this.onSubmit}
                additionalControl={(
                    <Link to={Routes.login}>
                        To Login
                    </Link>
                )}
            />;
    }
}
