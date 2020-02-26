import React from 'react';
import {withRouter} from 'react-router-dom';

import {AuthContext} from '../AuthProvider';
import Alert from '../alert/Alert';
import gameServices from '../../services/gameServices';
import {Routes} from '../../constants/routes';

class GameAlert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opponentId: undefined
        }
    }

    componentDidMount() {
        this.detachListener =
            gameServices.onNewChallenge(this.context.currentUser?.id, this.onNewOpponent, this.onRemoveOpponent);
    }

    componentWillUnmount() {
        this.detachListener();
    }

    onNewOpponent = opponentId => this.setState({opponentId});

    onRemoveOpponent = () => this.setState({opponentId: undefined});

    onAccept = () => {
        const gameId = gameServices.acceptChallenge(this.context.currentUser?.id, this.state.opponentId);
        this.props.history.push({
            pathname: Routes.game,
            state: {gameId, opponentId: this.state.opponentId, instigator: false}
        });
    };

    onRefuse = () => {
        gameServices.cancelChallenge(this.context.currentUser?.id, this.state.opponentId);
    };

    render() {
        if (!this.state.opponentId) {
            return <></>;
        }

        return (
            <Alert
                variant='error'
                title='New Challenge!'
                body='User challenges you to a fight'
                controls=
                    {<>
                        <button className='secondary' onClick={this.onRefuse}>
                            Refuse
                        </button>
                        <button onClick={this.onAccept}>
                            Accept
                        </button>
                    </>}
            />
        );
    }
}

GameAlert.contextType = AuthContext;

export default withRouter(GameAlert);
