import React from 'react';
import {withRouter} from 'react-router-dom';

import './Game.scss';
import GameService from '../../services/GameService';
import {AuthContext} from '../AuthProvider';
import Canvas from './canvas/Canvas';
import {COLORS} from './canvas/constants';
import Alert from '../alert/Alert';
import {Routes} from '../../constants/routes';

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.instigator = this.props.location.state?.instigator;
        this.pointColor = this.instigator ? COLORS.WHITE_POINT : COLORS.BLACK_POINT;
        this.opponentPointColor = this.instigator ? COLORS.BLACK_POINT : COLORS.WHITE_POINT;

        this.state = {
            move: undefined,
            opponentMove: undefined,
            canvasEnabled: false,
            gameOver: false
        }
    }

    componentDidMount() {
        if (!GameService.gameId) {
            this.props.history.push(Routes.home);
        } else {
            GameService.onNewOpponentMove(this.onNewOpponentMove);
            GameService.onChangeGameResult(this.onWin, this.onDefeat);
            window.addEventListener('beforeunload', this.onLeave);

            if (!this.instigator) {
                // TODO remove magic number
                this.onNewMove(7, 7);
                this.setState({move: {x: 7, y: 7}});
            }
        }
    }

    componentWillUnmount() {
        this.onLeave();
        window.removeEventListener('beforeunload', this.onLeave);
    }

    onLeave = () => {
        GameService.completeGame();
    };

    onNewOpponentMove = (x, y) => {
        this.setState({opponentMove: {x, y}, canvasEnabled: true});
    };

    onNewMove = (x, y) => {
        this.setState({canvasEnabled: false});
        GameService.newMove(x, y);
    };

    onWin = () => {
        const alert = {
            title: 'You win!',
            variant: 'primary'
        };
        this.setState({alert, gameOver: true});
        GameService.registerWin();
    };

    onDefeat = () => {
        const alert = {
            title: 'You defeat',
            variant: 'error'
        };
        this.setState({alert, gameOver: true});
        GameService.registerDefeat();
    };

    onCloseAlert = () => this.setState({alert: null, canvasEnabled: false});

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
                    onWin={this.onWin}
                />
                {this.state.alert &&
                <Alert
                    {...this.state.alert}
                    controls=
                        {<>
                            <button onClick={this.onCloseAlert}>
                                Ok
                            </button>
                        </>}
                />
                }
            </div>
        );
    }
}

Game.contextType = AuthContext;

export default withRouter(Game);
