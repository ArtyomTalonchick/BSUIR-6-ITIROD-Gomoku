import firebaseApp from '../firebaseApp';

const unpackUsers = users => Object.entries(users).map(([uid, value]) => ({id: uid, ...value}));


const createOrUpdate = (uid, name, email, image) => {
    const user = {};
    Object.entries({name, email, image}).forEach(([key, value]) => value && (user[key] = value));

    return firebaseApp
        .database()
        .ref('users/' + uid)
        .set(user)
};

const getAll = () =>
    new Promise(resolve =>
        firebaseApp
            .database()
            .ref('users')
            .on('value', response => resolve(unpackUsers(response.val())))
    );


export default {
    createOrUpdate,
    getAll
}
