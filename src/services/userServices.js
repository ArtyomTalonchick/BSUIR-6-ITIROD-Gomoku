import firebaseApp from '../firebaseApp';

const unpackUsers = users => Object.entries(users).map(([uid, value]) => ({id: uid, ...value}));

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

const getAll = callback =>
    firebaseApp
        .database()
        .ref('users')
        .once('value')
        .then(response => unpackUsers(response.val() || {}));


const getUser = uid =>
    firebaseApp
        .database()
        .ref(`users/${uid}`)
        .once('value')
        .then(response => ({id: uid, ...response.val()} || {}));


const onUserUpdate = (uid, callback) => {
    const fullCallback = response => callback({id: uid, ...response.val()} || {});
    firebaseApp
        .database()
        .ref(`users/${uid}`)
        .on('value', fullCallback);

    return () => firebaseApp
        .database()
        .ref(`users/${uid}`)
        .off('value', fullCallback);
};

export default {
    create,
    update,
    updateAvatar,
    onUserUpdate,
    getUser,
    getAll
}
