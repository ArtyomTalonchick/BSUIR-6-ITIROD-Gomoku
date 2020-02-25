import React from 'react';

import {AuthContext} from '../AuthProvider';
import Alert from '../alert/Alert';
import gameServices from '../../services/gameServices';
import Loader from '../loader/Loader';

export default class GamePromise extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opponentId: undefined,
            loading: false
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.opponent !== this.props.opponent) {
            this.sendRequestToOpponent();
        }
    }

    componentWillUnmount() {
        this.detachListener && this.detachListener();
    }

    sendRequestToOpponent = () => {
        this.setState({opponentId: this.props.opponent?.id, loading: true});
        if (this.props.opponent) {
            gameServices.toChallenge(this.props.opponent.id, this.context.currentUser?.id)
                .then(() => {
                    this.detachListener = gameServices.onChallengeStatusUpdate(
                        this.context.currentUser?.id, this.props.opponent.id, this.onAccept, this.onRefuse);
                });
        }
    };

    // TODO redirect to game
    onAccept = challengeStatus => {
        console.log('ACCEPT')
    };

    onRefuse = challengeStatus => {
        this.setState({loading: false});
        this.detachListener && this.detachListener();
    };

    onCancel = () => {
        gameServices.cancelChallenge(this.props.opponent.id, this.context.currentUser?.id)
            .then(this.props.onCancel);
    };

    render() {
        if (!this.state.opponentId) {
            return <></>;
        }

        return (
            <Alert
                variant='primary'
                title='New Challenge'
                body={
                    <div>
                        {this.state.loading ?
                            <Loader/>
                            :
                            <span>
                                The user has refused the game
                            </span>
                        }
                    </div>
                }
                controls=
                    {<>
                        <button className='secondary' onClick={this.onCancel}>
                            Cancel
                        </button>
                    </>}
            />
        );
    }
}

GamePromise.contextType = AuthContext;
