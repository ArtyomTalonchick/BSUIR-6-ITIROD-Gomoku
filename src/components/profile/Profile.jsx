import React from 'react';
import {withRouter} from 'react-router-dom';

import './Profile.scss';
import Form from '../form/Form';
import userServices from '../../services/userServices';
import Loader from '../loader/Loader';

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.id = this.props.match.params.id;

        this.state = {
            user: {},
            loading: false
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        userServices.getUserById(this.id)
            .then(user => this.setState({user, loading: false}));
    }

    onSubmit = fields => {
        console.log(fields);
    };

    render() {
        const user = this.state.user;
        const formFields = {
            name: {
                label: 'Name',
                value: user.name
            },
            field: {
                label: 'Field Long Name'
            },
        };
        return (
            <div className='profile-container'>
                {this.state.loading ?
                    <Loader/>
                    :
                    <>
                        <div className='image-block'>
                            <img src={user.img}/>
                            <button>
                                Change
                            </button>
                        </div>
                        <Form
                            fields={formFields}
                            onSubmit={this.onSubmit}
                            submitText='Save'
                        />
                    </>
                }
            </div>
        );
    }
}

export default withRouter(Profile)
