import React from 'react';
import {withRouter} from 'react-router-dom';

import './SearchPreview.scss';
import {Routes} from '../../../constants/routes';
import RouteHelper from '../../../helpers/RouteHelper';
import Image from '../../image/Image';
import UserStatusLabel from '../../userStatusLabel/UserStatusLabel';

class SearchPreview extends React.Component {

    onUserClick = () => this.props.history.push(RouteHelper.build(Routes.profile, {id: this.props.user.id}));

    render() {
        const user = this.props.user;
        return (
            <div className='search-preview-container'>
                <div className='image' onClick={this.onUserClick}>
                    <Image
                        src={user.img}
                        height='100px'
                        width='100px'
                    />
                </div>

                <div className='right-block'>
                    <div className='info' onClick={this.onUserClick}>
                        <UserStatusLabel user={user}/>
                        <span>{user.name}</span>
                    </div>
                    {this.props.challengePosseble &&
                    <button onClick={this.props.onChallenge}>
                        To challenge
                    </button>
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(SearchPreview)
