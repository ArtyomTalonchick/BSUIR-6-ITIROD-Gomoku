import React from 'react';
import {withRouter} from 'react-router-dom';

import './SearchPreview.scss';
import {Routes} from '../../../constants/routes';
import DefaultAvatar from '../../../images/DefaultAvatar.png';
import RouteHelper from '../../../helpers/RouteHelper';

class SearchPreview extends React.Component {

    onUserClick = () => this.props.history.push(RouteHelper.build(Routes.profile, {id: this.props.user.id}));

    render() {
        const user = this.props.user;
        return (
            <div className='search-preview-container'>
                <img src={user.img || DefaultAvatar} onClick={this.onUserClick}/>
                <div className='info-block'>
                    <span onClick={this.onUserClick}>
                        {user.name}
                    </span>
                    <button onClick={this.props.onChallenge}>
                        To challenge
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchPreview)
