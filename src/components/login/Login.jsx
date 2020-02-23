import React from 'react';
import {Link} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';
import Loader from '../loader/Loader';

const FIELDS = {
    email: {label: 'Login'},
    password: {label: 'Password', attributes: {type: 'password'}}
};

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: JSON.parse(JSON.stringify(FIELDS))
        };
    }

    onSubmit = fields => {
        // TODO: need to notify user
        if (!fields.email.value || !fields.password.value) {
            return;
        }
        this.setState({fields: JSON.parse(JSON.stringify(fields)), loading: true});
        authenticationServices.signIn(fields.email.value, fields.password.value)
            .catch(error => {
                this.setState({loading: false});
                // TODO: not use alert
                alert(error);
            });
    };

    render() {
        return this.state.loading ?
            <Loader/>
            :
            <Form
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
