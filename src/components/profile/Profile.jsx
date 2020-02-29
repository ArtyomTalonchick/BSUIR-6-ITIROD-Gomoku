import React from 'react';
import {withRouter} from 'react-router-dom';

import './Profile.scss';
import Form from '../form/Form';
import userServices from '../../services/userServices';
import Loader from '../loader/Loader';
import {AuthContext} from '../AuthProvider';
import Image from '../image/Image';

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            loading: false,
            imgLoading: false,
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
            userServices.getUser(id)
                .then(user => this.setState({user, loading: false}));
        }
    };

    onSubmit = fields => {
        this.setState({loading: true});
        const updates = {};
        Object.entries(fields).forEach(([name, body]) => updates[name] = body.value);

        userServices.update(this.state.user.id, updates)
            .then(() => this.setState({loading: false}));
    };

    onUploadImage = event => {
        this.setState({imgLoading: true});
        const file = event.target.files[0];
        userServices.updateAvatar(this.state.user.id, file)
            .then(() => this.setState({imgLoading: false}));
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
            <div className='profile-container blank'>
                {this.state.loading ?
                    <Loader/>
                    :
                    <>
                        <div className='image-block'>
                            <Image
                                loading={this.state.imgLoading}
                                src={user.img}
                                height='250px'
                                width='250px'
                            />
                            {this.state.canEdit &&
                            <label>
                                <span>
                                    Change
                                </span>
                                <input
                                    onChange={this.onUploadImage}
                                    type='file'
                                    accept='.jpg, .jpeg, .png'
                                />
                            </label>
                            }
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
