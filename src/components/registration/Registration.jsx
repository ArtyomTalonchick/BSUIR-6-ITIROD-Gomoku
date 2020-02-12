import React from 'react';
import {withRouter} from 'react-router-dom';

import Form from '../form/Form';
import {Routes} from '../../constants/roures';

const FIELDS = {
    email: {label: 'Email'},
    password: {label: 'Password'}
};

class Registration extends React.Component {

    constructor(props) {
        super(props);
    }

    toLogin = () => this.props.history.push(Routes.login);

    onSubmit = fields => {
        console.log(fields);
    };

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
