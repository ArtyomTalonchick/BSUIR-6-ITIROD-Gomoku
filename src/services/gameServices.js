import firebaseApp from '../firebaseApp';

const STATUSES = {
    WAIT: 'WAIT',
    ACCEPT: 'ACCEPT',
    REFUSE: null
};

const getRef = (opponentId, id) =>
    firebaseApp
        .database()
        .ref(`users/${opponentId}/games/${id}`);

const updateChallengeStatus = (opponentId, id, status) => getRef(opponentId, id).set(status);

const toChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, STATUSES.WAIT);

const cancelChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, STATUSES.REFUSE);

const acceptChallenge = (opponentId, id) => updateChallengeStatus(opponentId, id, STATUSES.ACCEPT);



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


export default {
    toChallenge,
    cancelChallenge,
    acceptChallenge,
    onChallengeStatusUpdate,
    onNewChallenge
}
