import React from 'react';

import './UserStatusLabel.scss';

export default class UserStatusLabel extends React.Component {

    render() {
        const dateFormatter = new Intl.DateTimeFormat('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });


        const online = this.props.user.connections;
        const lastOnline = this.props.user.lastOnline && dateFormatter.format(this.props.user.lastOnline);

        return (
            <div className='user-status-label-container'>
                {online &&
                <span className='online'>
                    online
                </span>
                }
                {!online && lastOnline &&
                <span className='last-online'>
                    {lastOnline}
                </span>}
            </div>
        );
    }
}
