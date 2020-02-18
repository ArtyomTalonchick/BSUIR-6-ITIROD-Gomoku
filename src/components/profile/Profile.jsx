import React from 'react';
import {withRouter} from 'react-router-dom';

import './Profile.scss';
import Form from '../form/Form';
import userServices from '../../services/userServices';
import Loader from '../loader/Loader';
import {AuthContext} from '../AuthProvider';

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            loading: false,
            canEdit: false
        }
    }

    componentDidMount() {
        this.updateUser();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.updateUser();
        }
    }

    updateUser = () => {
        this.currentUser = this.context.currentUser;
        const id = this.props.match.params.id;
        if (!id || id === this.currentUser?.id) {
            this.setState({user: this.currentUser, loading: false, canEdit: true});
        } else {
            this.setState({loading: true});
            userServices.getUserById(id)
                .then(user => this.setState({user, loading: false}));
        }
    };

    onSubmit = fields => {
        this.setState({loading: true});
        const updates = {};
        Object.entries(fields).forEach(([name, body]) => updates[name] = body.value);

        userServices.update(this.state.user.id, updates)
            .then(this.context.updateCurrentUser());
    };

    render() {
        const user = this.state.user;
        const formFields = {
            name: {
                label: 'Name',
                value: user.name
            }
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
                            disabled={!this.state.canEdit}
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

Profile.contextType = AuthContext;

export default withRouter(Profile)
