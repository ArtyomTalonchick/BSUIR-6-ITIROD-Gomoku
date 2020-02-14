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
            loading: false
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
        const id = this.props.match.params.id;
        if (id) {
            this.setState({loading: true});
            userServices.getUserById(id)
                .then(user => this.setState({user, loading: false}));
        } else {
            const {currentUser} = this.context;
            this.setState({user: currentUser});
        }

    };

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

Profile.contextType = AuthContext;

export default withRouter(Profile)
