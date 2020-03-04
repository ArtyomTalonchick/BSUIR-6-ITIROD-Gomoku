import firebaseApp from '../firebaseApp';
import userStatuses from '../constants/userStatuses';

const getFormattedUser = (user, uid) => {
    user.id = uid;

    if (!user.connections) {
        user.status = userStatuses.OFFLINE;
    } else if (user.games) {
        user.status = userStatuses.IS_PLAYING;
    } else {
        user.status = userStatuses.ONLINE;
    }

    return user;
};

const unpackUsers = users => Object.entries(users).map(([uid, user]) => getFormattedUser(user, uid));

const create = (uid, name, email, image) => {
    const user = {};
    Object.entries({name, email, image}).forEach(([key, value]) => value && (user[key] = value));

    return firebaseApp
        .database()
        .ref(`users/${uid}`)
        .set(user)
};

const update = (uid, fields) => {
    return firebaseApp
        .database()
        .ref(`users/${uid}`)
        .update(fields)
};

const updateAvatar = (uid, file) =>
    new Promise(resolve =>
        firebaseApp
            .storage()
            .ref(`avatar/${uid}`)
            .put(file)
            .then(snapshot => {
                snapshot.ref.getDownloadURL()
                    .then(downloadURL =>
                        update(uid, {img: downloadURL})
                            .then(resolve)
                    )
            })
    );


const getUser = uid =>
    firebaseApp
        .database()
        .ref(`users/${uid}`)
        .once('value')
        .then(response => getFormattedUser(response.val(), uid));


const onAllUsersUpdate = callback => {
    const fullCallback = response => callback(unpackUsers(response.val() || {}));

    const ref = firebaseApp.database().ref('users');
    ref.on('value', fullCallback);
    return () => ref.off('value', fullCallback);
};

const onUserUpdate = (uid, callback) => {
    const fullCallback = response => callback(getFormattedUser(response.val(), uid));

    const ref = firebaseApp.database().ref(`users/${uid}`);
    ref.on('value', fullCallback);
    return () => ref.off('value', fullCallback);
};

const getUserHistory = uid =>
    firebaseApp
        .database()
        .ref(`histories/${uid}`)
        .once('value')
        .then(histories =>
            histories.val() ? Object.entries(histories.val()).map(([date, value]) => ({...value, date})) : []);

export default {
    create,
    update,
    updateAvatar,
    onUserUpdate,
    onAllUsersUpdate,
    getUser,
    getUserHistory
}
