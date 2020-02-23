import React from 'react';
import {Link} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';
import Loader from '../loader/Loader';

const FIELDS = {
    email: {label: 'Email'},
    password: {label: 'Password', attributes: {type: 'password'}}
};

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: JSON.parse(JSON.stringify(FIELDS)),
            error: ''
        };
    }

    onSubmit = fields => {
        if (!fields.email.value || !fields.password.value) {
            this.setState({error: 'All fields must be filled'});
            return;
        }
        this.setState({fields: JSON.parse(JSON.stringify(fields)), loading: true});
        authenticationServices.signIn(fields.email.value, fields.password.value)
            .catch(error => this.setState({loading: false, error: error.message}));
    };

    render() {
        return this.state.loading ?
            <Loader/>
            :
            <Form
                error={this.state.error}
                title='Login'
                fields={this.state.fields}
                onSubmit={this.onSubmit}
                additionalControl={(
                    <Link to={Routes.registration}>
                        To Registration
                    </Link>
                )}
            />;
    }
}
