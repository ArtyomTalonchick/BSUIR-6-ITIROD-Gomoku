import React from 'react';
import firebaseApp from '../services/firebaseApp';

export const AuthContext = React.createContext();

export default class AuthProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(this.setCurrentUser);
    }

    setCurrentUser = user => this.setState({currentUser: user});

    render() {
        return (
            <AuthContext.Provider value={{currentUser: this.state.currentUser}}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }

}
