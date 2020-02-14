import React from 'react';
import firebaseApp from '../firebaseApp';
import userServices from '../services/userServices';

export const AuthContext = React.createContext();

export default class AuthProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(this.setCurrentUser);
    }

    setCurrentUser = user => {
        if(user){
            userServices.getUserById(user.uid)
                .then(dbUser => this.setState({currentUser: dbUser}));
        } else {
            this.setState({currentUser: null});
        }
    };

    render() {
        return (
            <AuthContext.Provider value={{currentUser: this.state.currentUser}}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }

}
