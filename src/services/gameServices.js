import firebaseApp from '../firebaseApp';

const STATUSES = {
    WAIT: 'WAIT',
    ACCEPT: 'ACCEPT',
    REFUSE: null
};

const getRef = (id, opponentId) =>
    firebaseApp
        .database()
        .ref(`users/${opponentId}/games/${id}`);

const updateChallengeStatus = (id, opponentId, status) => getRef(id, opponentId).set(status);

const toChallenge = (opponentId, id) => updateChallengeStatus(id, opponentId, STATUSES.WAIT);

const cancelChallenge = (opponentId, id) => updateChallengeStatus(id, opponentId, STATUSES.REFUSE);

const acceptChallenge = (opponentId, id) => updateChallengeStatus(id, opponentId, STATUSES.ACCEPT);


const onChallengeStatusUpdate = (id, opponentId, acceptCallback, refuseCallback) => {
    const fullCallback = response => {
        if (response.val() === STATUSES.ACCEPT) {
            acceptCallback();
        } else if (!response.val()) {
            refuseCallback();
        }
    };
    getRef(id, opponentId).on('value', fullCallback);

    return () => getRef(id, opponentId).off('value', fullCallback);
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


export default {
    toChallenge,
    cancelChallenge,
    acceptChallenge,
    onChallengeStatusUpdate,
    onNewChallenge
}
