import firebaseApp from '../firebaseApp';

const createOrUpdate = (uid, name, email, image) => {
    const user = {};
    Object.entries({name, email, image}).forEach(([key, value]) => value && (user[key] = value));

    return firebaseApp
        .database()
        .ref('users/' + uid)
        .set(user)
};

export default {
    createOrUpdate
}
