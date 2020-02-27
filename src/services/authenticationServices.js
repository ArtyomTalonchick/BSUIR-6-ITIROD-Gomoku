import firebaseApp from '../firebaseApp';
import userServices from './userServices';

export default class AuthService {
    static connectionsRef;
    static lastOnlineRef;
    static connectionRef;

    static detachUserListener;

    static signUp = (name, email, password) =>
        firebaseApp
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => userServices.create(response.user.uid, name, email));

    static signIn = (email, password) =>
        firebaseApp
            .auth()
            .signInWithEmailAndPassword(email, password);

    static signOut = () => {
        this.connectionRef && this.connectionRef.remove();
        this.lastOnlineRef && this.lastOnlineRef.set(Date.now());
        return firebaseApp.auth().signOut();
    };

    static onAuthStateChanged = callback => {
        firebaseApp.auth().onAuthStateChanged(user => {
            this.detachListeners();
            if (user) {
                this.detachUserListener = userServices.onUserUpdate(user.uid, callback);

                this.connectionsRef = firebaseApp.database().ref(`users/${user.uid}/connections`);
                this.lastOnlineRef = firebaseApp.database().ref(`users/${user.uid}/lastOnline`);

                const connectedRef = firebaseApp.database().ref('.info/connected');
                connectedRef.on('value', this.onConnected);
            } else {
                callback(null);
            }
        });
    };

    static detachListeners = () => {
        this.detachUserListener && this.detachUserListener();
    };

    static onConnected = response => {
        if (response.val() === true) {
            this.connectionRef = this.connectionsRef.push();
            this.connectionRef.set(true);
            this.connectionRef.onDisconnect().remove();
            this.lastOnlineRef.onDisconnect().set(Date.now());
        }
    };
};