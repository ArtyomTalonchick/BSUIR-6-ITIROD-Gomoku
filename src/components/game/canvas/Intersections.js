import {COLORS} from './constants';

export default class Intersections {
    constructor(count, canvas, pointColor) {
        this.pointColor = pointColor;
        this.count = count;
        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');
        this.previousIntersection = undefined;

        this.initIntersections();
    }

    initIntersections = () => {
        this.cellSize = Math.round(this.canvas.width / (this.count + 1));
        this.intersectionSize = Math.ceil(this.cellSize * 0.45);

        this.intersections = new Array(this.count);
        for (let i = 0; i < this.count; i++) {
            this.intersections[i] = new Array(this.count);
            const x = this.cellSize * (i + 1);
            for (let j = 0; j < this.count; j++) {
                const y = this.cellSize * (j + 1);
                this.intersections[i][j] = {x, y, i, j}
            }
        }
    };

    updateSize = () => {
        this.cellSize = Math.round(this.canvas.width / (this.count + 1));
        this.intersectionSize = Math.ceil(this.cellSize * 0.45);
        for (let i = 0; i < this.count; i++) {
            const x = this.cellSize * (i + 1);
            for (let j = 0; j < this.count; j++) {
                const y = this.cellSize * (j + 1);
                const intersection = this.intersections[i][j];
                intersection.x = x;
                intersection.y = y;
                if (!this.isFree(intersection))
                    this.setColor(intersection, intersection.color);
            }
        }
    };

    getIntersectionFromMousePosition = mouseEvent => {
        const mouseX = mouseEvent.pageX - this.canvas.offsetLeft;
        const mouseY = mouseEvent.pageY - this.canvas.offsetTop;
        const i = Math.round(mouseX / this.cellSize) - 1;
        const j = Math.round(mouseY / this.cellSize) - 1;

        if (i < 0 || i >= this.count || j < 0 || j >= this.count) return undefined;
        if (Math.pow(this.intersections[i][j].x - mouseX, 2)
            + Math.pow(this.intersections[i][j].y - mouseY, 2)
            > Math.pow(this.intersectionSize, 2))
            return undefined;
        return this.intersections[i][j];

    };

    onMouseMove = event => {
        const currentIntersection = this.getIntersectionFromMousePosition(event);
        if (this.isFree(currentIntersection) && currentIntersection !== this.previousIntersection) {
            this.setColor(currentIntersection, COLORS.HOVER_POINT);
        }
        this.updatePreviousIntersection(currentIntersection);
    };

    onMouseDown = event => {
        const currentIntersection = this.getIntersectionFromMousePosition(event);
        if (currentIntersection && this.isFree(currentIntersection)) {
            this.setColor(currentIntersection, this.pointColor);
            return {x: currentIntersection.i, y: currentIntersection.j};
        }
    };

    updatePreviousIntersection = currentIntersection => {
        if (this.isFree(this.previousIntersection) && currentIntersection !== this.previousIntersection) {
            this.setColor(this.previousIntersection, COLORS.BACKGROUND);
            this.updateLinesOnIntersection(this.previousIntersection);
        }
        this.previousIntersection = currentIntersection;
    };

    isFree = intersection => intersection && ![COLORS.BLACK_POINT, COLORS.WHITE_POINT].includes(intersection.color);

    update = (i, j, color) => this.setColor(this.intersections[i][j], color);

    setColor = (intersection, color) => {
        intersection.color = color;
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.arc(intersection.x, intersection.y, this.intersectionSize, 0, 2 * Math.PI);
        this.canvasCtx.stroke();
        this.canvasCtx.fill();
        this.canvasCtx.closePath();
    };

    updateLinesOnIntersection = intersection => {
        this.canvasCtx.beginPath();
        this.canvasCtx.strokeStyle = COLORS.LINE;
        this.canvasCtx.moveTo(intersection.x, intersection.y - this.intersectionSize);
        this.canvasCtx.lineTo(intersection.x, intersection.y + this.intersectionSize);
        this.canvasCtx.moveTo(intersection.x - this.intersectionSize, intersection.y);
        this.canvasCtx.lineTo(intersection.x + this.intersectionSize, intersection.y);
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
    };

}
