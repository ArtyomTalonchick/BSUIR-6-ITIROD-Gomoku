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
        this.checkOpponent();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.checkOpponent();
    }

    checkOpponent = () => {
        const games = this.context.currentUser.games;
        if (games) {
            const opponentId = Object.keys(games)[0];
            const gameStatus = games[opponentId];
            if (opponentId !== this.state.opponentId && gameStatus === gameServices.STATUSES.WAIT) {
                this.setState({opponentId});
            } else if (opponentId === this.state.opponentId && gameStatus !== gameServices.STATUSES.WAIT){
                this.setState({opponentId: undefined});
            }
        } else if (this.state.opponentId) {
            this.setState({opponentId: undefined});
        }
    };

    onAccept = () => {
        gameServices.acceptChallenge(this.context.currentUser?.id, this.state.opponentId);
        this.props.history.push({
            pathname: Routes.game,
            state: {opponentId: this.state.opponentId, instigator: false}
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
