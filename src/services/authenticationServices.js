import firebaseApp from '../firebaseApp';

const signUp = (email, password) =>
    firebaseApp
        .auth()
        .signInWithEmailAndPassword(email, password);

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
