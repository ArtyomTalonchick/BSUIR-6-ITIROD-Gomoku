import React from 'react';
import {withRouter} from 'react-router-dom';

import './SearchPreview.scss';
import {Routes} from '../../../constants/routes';

class SearchPreview extends React.Component {

    onUserClick = () => this.props.history.push(`${Routes.profile}/${this.props.user.id}`);

    render() {
        const user = this.props.user;
        return (
            <div className='search-preview-container'>
                <img src={user.img} onClick={this.onUserClick}/>
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
