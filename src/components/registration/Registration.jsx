import React from 'react';
import {withRouter} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/routes';
import authenticationServices from '../../services/authenticationServices';

const FIELDS = {
    name: {label: 'Name'},
    email: {label: 'Email'},
    password: {label: 'Password', attributes: {type: 'password'}}
};

class Registration extends React.Component {

    toLogin = () => this.props.history.push(Routes.login);

    onSubmit = fields =>
        authenticationServices.signUp(fields.name.value, fields.email.value, fields.password.value)
            .then(() => this.props.history.push(Routes.profile))
            .catch(error => alert(error));

    render() {
        return (
            <Form
                title='Registration'
                fields={FIELDS}
                onSubmit={this.onSubmit}
                additionalControl={(
                    <button className='secondary' onClick={this.toLogin}>
                        To Login
                    </button>
                )}
            />
        );
    }
}

export default withRouter(Registration)
