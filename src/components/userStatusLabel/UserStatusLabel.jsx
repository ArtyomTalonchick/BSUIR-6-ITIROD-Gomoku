import React from 'react';

import './UserStatusLabel.scss';
import userStatuses from '../../constants/userStatuses';

export default class UserStatusLabel extends React.Component {

    render() {
        const dateFormatter = new Intl.DateTimeFormat('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });

        return (
            <div className='user-status-label-container'>
                {this.props.user.status === userStatuses.ONLINE &&
                <span className='online'>
                    online
                </span>
                }
                {this.props.user.status === userStatuses.OFFLINE &&
                <span className='offline'>
                    {dateFormatter.format(this.props.user.lastOnline)}
                </span>
                }
                {this.props.user.status === userStatuses.IS_PLAYING &&
                <span className='is-playing'>
                    Is playing
                </span>
                }
            </div>
        );
    }
}
