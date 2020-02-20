import React from 'react';

import './Game.scss';
import Canvas from './canvas/Canvas';

export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        return (
            <div className='game-container'>
                <Canvas/>
            </div>
        );
    }
}
