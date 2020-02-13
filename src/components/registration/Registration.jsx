import React from 'react';
import {withRouter} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/roures';
import firebaseApp from '../../services/firebaseApp';

const FIELDS = {
    email: {label: 'Email'},
    password: {label: 'Password', attributes: {type: 'password'}}
};

class Registration extends React.Component {

    toLogin = () => this.props.history.push(Routes.login);

    onSubmit = fields =>
        firebaseApp
            .auth()
            .createUserWithEmailAndPassword(fields.email.value, fields.password.value)
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
