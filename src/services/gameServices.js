import firebaseApp from '../firebaseApp';

const GAME_REQUEST_STATUSES = {
    WAIT: 'WAIT',
    ACCEPT: 'ACCEPT',
    REFUSE: null
};

const GAME_RESULT_STATUSES = {
    WIN: 'WIN',
    DEFEAT: 'DEFEAT',
    DRAW: 'DRAW'
};

const getGameRequestRef = (id1, id2) => firebaseApp.database().ref(`users/${id1}/games/${id2}`);

const getGameResultRef = (id, gameId) => firebaseApp.database().ref(`users/${id}/history/${gameId}`);

const updateGameRequestStatus = (opponentId, id, status) => getGameRequestRef(opponentId, id).set(status);

const createGameRequest = (opponentId, id) => updateGameRequestStatus(opponentId, id, GAME_REQUEST_STATUSES.WAIT);

const cancelGameRequest = (opponentId, id) => updateGameRequestStatus(opponentId, id, GAME_REQUEST_STATUSES.REFUSE);

const acceptGameRequest = (opponentId, id) => {
    const gameId = Date.now();
    const status = `${GAME_REQUEST_STATUSES.ACCEPT}-${gameId}`;
    updateGameRequestStatus(id, opponentId, status)
        .then(() => updateGameRequestStatus(opponentId, id, status));
    return gameId;
};

const newMove = (opponentId, id, x, y) => updateGameRequestStatus(opponentId, id, `${x}-${y}`);

const registerWin = (id, opponentId, gameId) => {
    getGameResultRef(id, gameId).set({opponentId, status: GAME_RESULT_STATUSES.WIN});
    cancelGameRequest(opponentId, id);
};

const registerDefeat = (id, opponentId, gameId) => {
    getGameResultRef(id, gameId).set({opponentId, status: GAME_RESULT_STATUSES.DEFEAT});
    cancelGameRequest(opponentId, id);
};

const onGameRequestStatusUpdate = (opponentId, id, acceptCallback, refuseCallback) => {
    const fullCallback = response => {
        const responseValue = response.val();
        const r = new RegExp(`^${GAME_REQUEST_STATUSES.ACCEPT}-(\\d+)`);
        if (r.test(responseValue)) {
            acceptCallback(responseValue.match(r)[1]);
        } else if (!response.val()) {
            refuseCallback();
        }
    };
    getGameRequestRef(opponentId, id).on('value', fullCallback);

    return () => getGameRequestRef(opponentId, id).off('value', fullCallback);
};

const onNewGameRequest = (id, onCreatedCallback, onRemovedCallback) => {
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
    return () => ref.off('value', fullCallback);
};

const onNewOpponentMove = (opponentId, id, callback) => {
    const fullCallback = response => {
        const responseValue = response.val();
        const r = /\d+-\d+/;
        if (r.test(responseValue)) {
            const [x, y] = responseValue.split('-').map(v => parseInt(v));
            callback(x, y);
        }
    };

    getGameRequestRef(id, opponentId).on('value', fullCallback);
    return () => getGameRequestRef(id, opponentId).off('value', fullCallback);
};

const onChangeGameResult = (opponentId, gameId, onWin, onDefeat) => {
    const fullCallback = response => {
        const status = response.val()?.status;
        if (status === GAME_RESULT_STATUSES.WIN) {
            onDefeat();
        } else if (status === GAME_RESULT_STATUSES.DEFEAT) {
            onWin();
        }
    };

    getGameResultRef(opponentId, gameId).on('value', fullCallback);
    return () => getGameResultRef(opponentId, gameId).off('value', fullCallback);
};

export default {
    createGameRequest,
    cancelGameRequest,
    acceptGameRequest,
    newMove,
    registerWin,
    registerDefeat,
    onGameRequestStatusUpdate,
    onNewGameRequest,
    onNewOpponentMove,
    onChangeGameResult
}
