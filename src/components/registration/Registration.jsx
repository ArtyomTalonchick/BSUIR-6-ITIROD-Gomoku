import React from 'react';
import {Link} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';

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
            fields: JSON.parse(JSON.stringify(FIELDS))
        }
    }

    onSubmit = fields => {
        // TODO: need to notify user
        if (!fields.name.value || !fields.email.value || !fields.password.value) {
            return;
        }
        if (fields.password.value !== fields.confirmPassword.value) {
            return;
        }
        this.setState({fields: JSON.parse(JSON.stringify(fields)), loading: true});
        authenticationServices.signUp(fields.name.value, fields.email.value, fields.password.value)
            .catch(error => {
                this.setState({loading: false});
                // TODO: not use alert
                alert(error);
            });
    };

    render() {
        return (
            <Form
                title='Registration'
                fields={this.state.fields}
                onSubmit={this.onSubmit}
                additionalControl={(
                    <Link to={Routes.login}>
                        To Login
                    </Link>
                )}
            />
        );
    }
}
