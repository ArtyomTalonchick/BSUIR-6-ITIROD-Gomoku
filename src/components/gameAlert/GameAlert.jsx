import React from 'react';
import {withRouter} from 'react-router-dom';

import {AuthContext} from '../AuthProvider';
import Alert from '../alert/Alert';
import GameService from '../../services/GameService';
import {Routes} from '../../constants/routes';

class GameAlert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opponentId: undefined
        }
    }

    componentDidMount() {
        GameService.onNewGameRequest(this.context.currentUser?.id, this.onNewOpponent, this.onRemoveOpponent);
    }

    componentWillUnmount() {
        GameService.detachGameRequestListener();
    }

    onNewOpponent = opponentId => this.setState({opponentId});

    onRemoveOpponent = () => this.setState({opponentId: undefined});

    onAccept = () => {
        GameService.acceptGameRequest(this.context.currentUser.id, this.state.opponentId)
            .then(() => this.props.history.push({pathname: Routes.game, state: {instigator: false}}));
    };

    onRefuse = () => {
        GameService.cancelGameRequest(this.context.currentUser.id, this.state.opponentId);
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
