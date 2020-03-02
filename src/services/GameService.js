import firebaseApp from '../firebaseApp';
import gameResultStatuses from '../constants/gameResultStatuses';
import userServices from './userServices';

const GAME_REQUEST_STATUSES = {
    WAIT: 'WAIT',
    ACCEPT: 'ACCEPT',
    PROCESS: 'PROCESS',
    REFUSE: null
};

export default class {

    static userId;
    static opponentId;
    static gameId;

    static detachGameRequestStatusListener;
    static detachGameRequestListener;

    static detachMoveListener;
    static detachDefeatListener;

    static getGameRequestRef = (id1, id2) => firebaseApp.database().ref(`users/${id1}/games/${id2}`);

    static getGameResultRef = (id) => firebaseApp.database().ref(`histories/${id}/${this.gameId}`);

    static updateGameRequestStatus = (opponentId, id, status) => this.getGameRequestRef(opponentId, id).set(status);

    static createGameRequest = (opponentId, id) => {
        this.userId = id;
        this.opponentId = opponentId;
        return this.updateGameRequestStatus(this.opponentId, this.userId, GAME_REQUEST_STATUSES.WAIT)
            .then(() => this.updateGameRequestStatus(this.userId, this.opponentId, GAME_REQUEST_STATUSES.ACCEPT));
    };

    static completeGame = () => {
        if (!this.userId || !this.opponentId) {
            return;
        }
        firebaseApp.database().ref(`users/${this.userId}/games`).remove();
        this.getGameResultRef(this.opponentId).once('value', result => {
            if (!result.val()) {
                this.registerDefeat()
                    .then(this.clearFields);
            } else {
                this.clearFields();
            }
        });
    };

    static cancelGameRequest = (userId, opponentId) => {
        this.clearFields();
        return this.updateGameRequestStatus(opponentId, userId, GAME_REQUEST_STATUSES.REFUSE)
            .then(() => this.updateGameRequestStatus(userId, opponentId, GAME_REQUEST_STATUSES.REFUSE));
    };

    static acceptGameRequest = (id, opponentId) => {
        this.userId = id;
        this.opponentId = opponentId;
        this.gameId = Date.now();
        const status = `${GAME_REQUEST_STATUSES.ACCEPT}-${this.gameId}`;
        return this.updateGameRequestStatus(id, opponentId, status)
            .then(() => this.updateGameRequestStatus(opponentId, id, status));
    };

    static newMove = (x, y) => this.updateGameRequestStatus(this.opponentId, this.userId, `${x}-${y}`);

    static registerResult = status => {

        return userServices.getUser(this.opponentId)
            .then(opponent =>
                this.getGameResultRef(this.userId).set({
                    opponentId: this.opponentId,
                    opponentName: opponent.name,
                    status
                })
            );
    };


    static registerWin = () => this.registerResult(gameResultStatuses.WIN);

    static registerDefeat = () => this.registerResult(gameResultStatuses.DEFEAT);

    static onGameRequestStatusUpdate = (opponentId, id, acceptCallback, refuseCallback) => {
        const fullCallback = response => {
            const responseValue = response.val();
            const r = new RegExp(`^${GAME_REQUEST_STATUSES.ACCEPT}-(\\d+)`);
            if (r.test(responseValue)) {
                this.gameId = responseValue.match(r)[1];
                acceptCallback();
            } else if (!response.val()) {
                refuseCallback();
            }
        };

        const ref = this.getGameRequestRef(opponentId, id);
        ref.on('value', fullCallback);
        this.detachGameRequestStatusListener = () => ref.off('value', fullCallback);
    };

    static onNewGameRequest = (id, onCreatedCallback, onRemovedCallback) => {
        let previousOpponentId;
        const fullCallback = response => {
            const games = response.val();
            if (games) {
                const opponentId = Object.keys(games)[0];
                const gameStatus = games[opponentId];
                if (opponentId !== previousOpponentId && gameStatus === GAME_REQUEST_STATUSES.WAIT) {
                    onCreatedCallback(opponentId);
                    previousOpponentId = opponentId;
                } else if (opponentId === previousOpponentId && gameStatus !== GAME_REQUEST_STATUSES.WAIT) {
                    onRemovedCallback();
                    previousOpponentId = undefined;
                }
            } else if (previousOpponentId) {
                onRemovedCallback();
                previousOpponentId = undefined;
            }
        };

        const ref = firebaseApp.database().ref(`users/${id}/games`);
        ref.on('value', fullCallback);
        this.detachGameRequestListener = () => ref.off('value', fullCallback);
    };

    static onNewOpponentMove = callback => {
        const fullCallback = response => {
            const responseValue = response.val();
            const r = /\d+-\d+/;
            if (r.test(responseValue)) {
                const [x, y] = responseValue.split('-').map(v => parseInt(v));
                callback(x, y);
            }
        };

        const ref = this.getGameRequestRef(this.userId, this.opponentId);
        ref.on('value', fullCallback);
        this.detachMoveListener = () => ref.off('value', fullCallback);
    };

    static onChangeGameResult = (onWin, onDefeat) => {
        const fullCallback = response => {
            const status = response.val()?.status;
            if (status === gameResultStatuses.WIN) {
                onDefeat();
            } else if (status === gameResultStatuses.DEFEAT) {
                onWin();
            }
        };

        const ref = this.getGameResultRef(this.opponentId);
        ref.on('value', fullCallback);
        this.detachDefeatListener = () => ref.off('value', fullCallback);
    };

    static clearFields = () => {
        this.userId = undefined;
        this.opponentId = undefined;
        this.gameId = undefined;
        this.detachMoveListener && this.detachMoveListener();
        this.detachDefeatListener && this.detachDefeatListener();
    }
}
