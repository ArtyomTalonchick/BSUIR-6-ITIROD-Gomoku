import React from 'react';

import './Canvas.scss';
import {COLORS} from './constants';
import Intersections from './Intersections';

const WINDOW_OFFSET_TOP = 40;   //Header and margin
const FIELD_SIZE = 15;

export default class Canvas extends React.Component {

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.containerRef = React.createRef();

        this.canvas = undefined;
        this.canvasCtx = undefined;

        this.state = {
            windowSize: {}
        };

    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
        this.initCanvas();
        this.initIntersections();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.windowSize !== this.state.windowSize) {
            this.updateCanvasSize();
            this.intersections.updateSize();
        }

        if (JSON.stringify(prevProps.opponentMove) !== JSON.stringify(this.props.opponentMove && this.props.opponentMove)) {
            this.intersections.update(this.props.opponentMove.x, this.props.opponentMove.y, this.props.opponentPointColor);
        }

        if (JSON.stringify(prevProps.move) !== JSON.stringify(this.props.move && this.props.move)) {
            this.intersections.update(this.props.move.x, this.props.move.y, this.props.pointColor);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        this.setState({windowSize: {width: window.innerWidth, height: window.innerHeight}});
    };

    initCanvas = () => {
        this.canvas = this.canvasRef.current;
        this.canvasCtx = this.canvas.getContext('2d');
        this.updateCanvasSize();
    };

    initIntersections = () => {
        this.intersections = new Intersections(FIELD_SIZE, this.canvas, this.props.pointColor, this.props.onWin);
    };

    updateCanvasSize = () => {
        this.canvas.width = Math.min(this.containerRef.current.clientWidth,
            window.innerHeight - this.canvas.offsetTop - WINDOW_OFFSET_TOP);
        this.canvas.height = this.canvas.width;
        this.canvasCtx.fillStyle = COLORS.BACKGROUND;
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const cellWidth = Math.round(this.canvas.width / (FIELD_SIZE + 1));
        const cellHeight = Math.round(this.canvas.height / (FIELD_SIZE + 1));
        for (let i = 0; i < FIELD_SIZE; i++) {
            this.canvasCtx.stroke();
            this.canvasCtx.beginPath();
            const x = cellWidth * (i + 1);
            this.canvasCtx.moveTo(x, 0);
            this.canvasCtx.lineTo(x, this.canvas.height);
            const y = cellHeight * (i + 1);
            this.canvasCtx.moveTo(0, y);
            this.canvasCtx.lineTo(this.canvas.width, y);
            this.canvasCtx.strokeStyle = COLORS.LINE;
            this.canvasCtx.stroke();
            this.canvasCtx.closePath();
        }
    };

    onMouseMove = event => {
        if (!this.props.enabled)
            return;

        this.intersections.onMouseMove(event);
    };
    onMouseDown = event => {
        if (!this.props.enabled)
            return;

        const move = this.intersections.onMouseDown(event);
        if (move) {
            this.props.onNewMove(move.x, move.y);
        }
    };


    render() {
        return (
            <div ref={this.containerRef} className='canvas-container'>
                <canvas
                    ref={this.canvasRef}
                    onMouseMove={this.onMouseMove}
                    onMouseDown={this.onMouseDown}
                />
            </div>
        );
    }
}
