import React from 'react';

import {AuthContext} from '../AuthProvider';
import Alert from '../alert/Alert';
import gameServices from '../../services/gameServices';

export default class GameAlert extends React.Component {

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
        if (games && Object.keys(games)[0] !== this.state.opponentId) {
            this.setState({opponentId: Object.keys(games)[0]});
        } else if (!games && this.state.opponentId) {
            this.setState({opponentId: undefined});
        }
    };

    // TODO redirect to game
    onAccept = () => {
        gameServices.acceptChallenge(this.context.currentUser?.id, this.state.opponentId);
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
