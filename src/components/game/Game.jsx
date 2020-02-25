import React from 'react';
import {withRouter} from 'react-router-dom';

import './Game.scss';
import gameServices from '../../services/gameServices';
import {AuthContext} from '../AuthProvider';
import Canvas from './canvas/Canvas';
import {COLORS} from './canvas/constants';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.opponentId = this.props.location.state.opponentId;

        const instigator = this.props.location.state.instigator;
        this.pointColor = instigator ? COLORS.WHITE_POINT : COLORS.BLACK_POINT;
        this.opponentPointColor = instigator ? COLORS.BLACK_POINT : COLORS.WHITE_POINT;

        this.state = {
            move: undefined,
            opponentMove: undefined,
            canvasEnabled: false
        }
    }

    componentDidMount() {
        this.detachListener = gameServices.onNewOpponentMove(this.opponentId,
            this.context.currentUser?.id, this.onNewOpponentMove);
        if (!this.props.location.state.instigator) {
            // TODO remove magic number
            this.onNewMove(7, 7);
            this.setState({move: {x: 7, y: 7}});
        }
    }

    componentWillUnmount() {
        this.detachListener && this.detachListener();
    }

    onNewOpponentMove = (x, y) => {
        this.setState({opponentMove: {x, y}, canvasEnabled: true});
    };

    onNewMove = (x, y) => {
        this.setState({canvasEnabled: false});
        gameServices.newMove(this.opponentId, this.context.currentUser?.id, x, y);
    };

    render() {
        return (
            <div className='game-container'>
                <Canvas
                    enabled={this.state.canvasEnabled}
                    pointColor={this.pointColor}
                    opponentPointColor={this.opponentPointColor}
                    onNewMove={this.onNewMove}
                    move={this.state.move}
                    opponentMove={this.state.opponentMove}
                />
            </div>
        );
    }
}

Game.contextType = AuthContext;

export default withRouter(Game);
