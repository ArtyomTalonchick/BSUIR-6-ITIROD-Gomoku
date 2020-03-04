import React from 'react'

import RouteHelper from './RouteHelper';

export default class Router extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            match: false
        };
    }

    componentWillMount() {
        window.addEventListener('popstate', this.onUrlUpdate);
        RouteHelper.registerRoute(this);
        this.onUrlUpdate();
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.onUrlUpdate);
        RouteHelper.unregisterRoute(this);
    }

    onUrlUpdate = () => {
        const match = this.props.path === location.pathname;
        if (match !== this.state.match) {
            this.setState({match});
        } else if (match) {
            this.forceUpdate();
        }
    };

    render() {
        return this.state.match && React.createElement(this.props.component);
    }
}

export class Redirect extends React.Component {
    componentDidMount() {
        RouteHelper.historyReplace(this.props.to);
    }

    render() {
        return null
    }
}

export class Link extends React.Component {

    handleClick = event => {
        event.preventDefault();
        RouteHelper.historyPush(this.props.to);
    };

    render() {
        return (
            <a className={this.props.className} href={this.props.to} onClick={this.handleClick}>
                {this.props.children}
            </a>
        )
    }
}
