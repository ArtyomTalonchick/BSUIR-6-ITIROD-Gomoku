import React from 'react';
import {withRouter} from 'react-router-dom';

import './Profile.scss';
import Form from '../form/Form';
import userServices from '../../services/userServices';
import Loader from '../loader/Loader';
import {AuthContext} from '../AuthProvider';
import Image from '../image/Image';
import Popup from '../popup/Popup';
import UserStatusLabel from '../userStatusLabel/UserStatusLabel';
import GamePromise from '../gamePromise/GamePromise';
import userStatuses from '../../constants/userStatuses';
import GameHistoryTable from './gameHistoryTable/GameHistoryTable';

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            loading: false,
            imgLoading: false,
            gameHistoryLoading: false,
            canEdit: false
        }
    }

    componentDidMount() {
        this.setUser();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setUser();
        }
    }

    componentWillUnmount() {
        this.detachListener && this.detachListener();
    }

    setUser = () => {
        this.currentUser = this.context.currentUser;
        const id = this.props.match.params.id;
        if (!id || id === this.currentUser?.id) {
            this.setState({user: this.currentUser, loading: false, canEdit: true});
        } else {
            this.setState({loading: true});
            this.detachListener = userServices.onUserUpdate(id, this.onUserUpdate);
        }
    };

    setHistory = () => {
        this.setState({gameHistoryLoading: true});
        userServices.getUserHistory(this.state.user.id).then(gameHistory =>
            this.setState({gameHistory, gameHistoryLoading: false}));
    };

    onUserUpdate = user => {
        if (!this.state.challenge) {
            this.setState({user, loading: false});
        }
    };

    onEditMode = () => this.setState({editMode: true});

    onSaveChanges = fields => {
        this.setState({loading: true, editMode: false});
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

    onChallenge = () => this.setState({challenge: true});

    onCancelChallenge = () => this.setState({challenge: undefined});

    render() {
        const user = this.state.user;
        const challengePossible = user.id !== this.context.currentUser.id && user.status === userStatuses.ONLINE;
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
                        <div className='left-block'>
                            <Image
                                loading={this.state.imgLoading}
                                src={user.img}
                                height='250px'
                                width='250px'
                            />
                            {this.state.canEdit &&
                            <label className='upload-ing-button'>
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
                            {challengePossible &&
                            <button className='to-challenge' onClick={this.onChallenge}>
                                To challenge
                            </button>
                            }
                        </div>
                        <div className='right-block'>
                            <UserStatusLabel user={user}/>
                            <div className='name'>
                                {user.name}
                                {this.state.canEdit && <i className='fa fa-edit' onClick={this.onEditMode}/>}
                            </div>
                            <div className='history-block'>
                                {this.state.gameHistoryLoading && <Loader/>}
                                {!this.state.gameHistory && !this.state.gameHistoryLoading &&
                                <button className='secondary' onClick={this.setHistory}>
                                    Show history
                                </button>
                                }
                                {this.state.gameHistory &&
                                <GameHistoryTable games={this.state.gameHistory}/>
                                }
                            </div>
                        </div>
                    </>
                }
                {this.state.editMode &&
                <Popup>
                    <Form
                        disabled={!this.state.canEdit}
                        fields={formFields}
                        onSubmit={this.onSaveChanges}
                        submitText='Save'
                    />
                </Popup>
                }
                <GamePromise opponent={this.state.challenge && user} onCancel={this.onCancelChallenge}/>
            </div>
        );
    }
}

Profile.contextType = AuthContext;

export default withRouter(Profile)
