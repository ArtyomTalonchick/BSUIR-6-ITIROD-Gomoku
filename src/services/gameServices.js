import firebaseApp from '../firebaseApp';

const GAME_STATUSES = {
    WAIT: 'WAIT',
    ACCEPT: 'ACCEPT',
    REFUSE: null
};

const HISTORY_STATUSES = {
    WIN: 'WIN',
    DEFEAT: 'DEFEAT',
    DRAW: 'DRAW'
};

const getGameRef = (id1, id2) => firebaseApp.database().ref(`users/${id1}/games/${id2}`);

const getHistoryRef = (id, gameId) => firebaseApp.database().ref(`users/${id}/history/${gameId}`);

const updateChallengeStatus = (opponentId, id, status) => getGameRef(opponentId, id).set(status);

const toChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, GAME_STATUSES.WAIT);

const cancelChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, GAME_STATUSES.REFUSE);

const acceptChallenge = (opponentId, id) => {
    const gameId = Date.now();
    const status = `${GAME_STATUSES.ACCEPT}-${gameId}`;
    updateChallengeStatus(id, opponentId, status)
        .then(() => updateChallengeStatus(opponentId, id, status));
    return gameId;
};

const newMove = (opponentId, id, x, y) => updateChallengeStatus(opponentId, id, `${x}-${y}`);

const registerWin = (id, opponentId, gameId) =>
    getHistoryRef(id, gameId).set({opponentId, status: HISTORY_STATUSES.WIN});

const registerDefeat = (id, opponentId, gameId) =>
    getHistoryRef(id, gameId).set({opponentId, status: HISTORY_STATUSES.DEFEAT});


const onChallengeStatusUpdate = (opponentId, id, acceptCallback, refuseCallback) => {
    const fullCallback = response => {
        const responseValue = response.val();
        const r = new RegExp(`^${GAME_STATUSES.ACCEPT}-(\\d+)`);
        if (r.test(responseValue)) {
            acceptCallback(responseValue.match(r)[1]);
        } else if (!response.val()) {
            refuseCallback();
        }
    };
    getGameRef(opponentId, id).on('value', fullCallback);

    return () => getGameRef(opponentId, id).off('value', fullCallback);
};

const onNewChallenge = (id, onCreatedCallback, onRemovedCallback) => {
    let previousOpponentId;
    const fullCallback = response => {
        const games = response.val();
        if (games) {
            const opponentId = Object.keys(games)[0];
            const gameStatus = games[opponentId];
            if (opponentId !== previousOpponentId && gameStatus === GAME_STATUSES.WAIT) {
                onCreatedCallback(opponentId);
                previousOpponentId = opponentId;
            } else if (opponentId === previousOpponentId && gameStatus !== GAME_STATUSES.WAIT) {
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

    getGameRef(id, opponentId).on('value', fullCallback);
    return () => getGameRef(id, opponentId).off('value', fullCallback);
};

const onRegisterDefeat = (opponentId, gameId, callback) => {
    const fullCallback = response => {
        const status = response.val()?.status;
        if (status === HISTORY_STATUSES.WIN) {
            callback();
        }
    };

    getHistoryRef(opponentId, gameId).on('value', fullCallback);
    return () => getHistoryRef(opponentId, gameId).off('value', fullCallback);
};

export default {
    toChallenge,
    cancelChallenge,
    acceptChallenge,
    newMove,
    registerWin,
    registerDefeat,
    onChallengeStatusUpdate,
    onNewChallenge,
    onNewOpponentMove,
    onRegisterDefeat
}
