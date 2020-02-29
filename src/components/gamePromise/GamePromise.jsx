import React from 'react';
import {withRouter} from 'react-router-dom';

import {AuthContext} from '../AuthProvider';
import Alert from '../alert/Alert';
import GameService from '../../services/GameService';
import Loader from '../loader/Loader';
import {Routes} from '../../constants/routes';

class GamePromise extends React.Component {

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
        GameService.detachGameRequestStatusListener && GameService.detachGameRequestStatusListener();
    }

    sendRequestToOpponent = () => {
        const opponentId = this.props.opponent?.id;
        this.setState({opponentId, loading: true});
        if (opponentId) {
            GameService.createGameRequest(opponentId, this.context.currentUser.id)
                .then(() => {
                    GameService.onGameRequestStatusUpdate(opponentId,
                        this.context.currentUser.id, this.onAccept, this.onRefuse);
                });
        }
    };

    onAccept = () =>
        this.props.history.push({
            pathname: Routes.game,
            state: {instigator: true}
        });


    onRefuse = () => {
        this.setState({loading: false});
        GameService.detachGameRequestStatusListener && GameService.detachGameRequestStatusListener();
    };

    onCancel = () => {
        GameService.cancelGameRequest(this.state.opponentId, this.context.currentUser.id)
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

export default withRouter(GamePromise);
