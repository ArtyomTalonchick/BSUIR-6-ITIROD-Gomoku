import firebaseApp from '../firebaseApp';

const STATUSES = {
    WAIT: 'WAIT',
    ACCEPT: 'ACCEPT',
    REFUSE: null
};

const getRef = (id1, id2) =>
    firebaseApp
        .database()
        .ref(`users/${id1}/games/${id2}`);

const updateChallengeStatus = (opponentId, id, status) => getRef(opponentId, id).set(status);

const toChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, STATUSES.WAIT);

const cancelChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, STATUSES.REFUSE);

const acceptChallenge = (opponentId, id) =>
    updateChallengeStatus(id, opponentId, STATUSES.ACCEPT)
        .then(() => updateChallengeStatus(opponentId, id, STATUSES.ACCEPT));

const newMove = (opponentId, id, x, y) => updateChallengeStatus(opponentId, id, `${x}-${y}`);


const onChallengeStatusUpdate = (opponentId, id, acceptCallback, refuseCallback) => {
    const fullCallback = response => {
        if (response.val() === STATUSES.ACCEPT) {
            acceptCallback();
        } else if (!response.val()) {
            refuseCallback();
        }
    };
    getRef(opponentId, id).on('value', fullCallback);

    return () => getRef(opponentId, id).off('value', fullCallback);
};

const onNewChallenge = (id, onCreatedCallback, onRemovedCallback) => {
    let previousOpponentId;
    const fullCallback = response => {
        const games = response.val();
        if (games) {
            const opponentId = Object.keys(games)[0];
            const gameStatus = games[opponentId];
            if (opponentId !== previousOpponentId && gameStatus === STATUSES.WAIT) {
                onCreatedCallback(opponentId);
                previousOpponentId = opponentId;
            } else if (opponentId === previousOpponentId && gameStatus !== STATUSES.WAIT) {
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

    getRef(id, opponentId).on('value', fullCallback);
    return () => getRef(id, opponentId).off('value', fullCallback);
};


export default {
    toChallenge,
    cancelChallenge,
    acceptChallenge,
    newMove,
    onChallengeStatusUpdate,
    onNewChallenge,
    onNewOpponentMove
}
