import React from 'react';
import authenticationServices from '../services/authenticationServices';

export const AuthContext = React.createContext();

export default class AuthProvider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        authenticationServices.onAuthStateChanged(currentUser => this.setState({currentUser}));
    }

    componentWillUnmount() {
        authenticationServices.detachListeners();
    }

    render() {
        return (
            <AuthContext.Provider
                value={{currentUser: this.state.currentUser}}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }

}
