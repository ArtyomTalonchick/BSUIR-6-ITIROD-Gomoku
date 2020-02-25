import React from 'react';
import {withRouter} from 'react-router-dom';

import './Game.scss';
import Canvas from './canvas/Canvas';

class Game extends React.Component {

    constructor(props) {
        super(props);

        console.log(this.props.location.state);

        this.state = {}
    }


    render() {
        return (
            <div className='game-container'>
                <Canvas/>
            </div>
        );
    }
}

export default withRouter(Game);
