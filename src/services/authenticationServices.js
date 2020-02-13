import firebaseApp from '../firebaseApp';
import userServices from './userServices';

const signUp = (name, email, password) =>
    firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => userServices.createOrUpdate(response.user.uid, name, email));

const signIn = (email, password) =>
    firebaseApp
        .auth()
        .signInWithEmailAndPassword(email, password);

const signOut = () => firebaseApp.auth().signOut();

export default {
    signUp,
    signIn,
    signOut
}
