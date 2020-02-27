import React from 'react';
import {withRouter} from 'react-router-dom';

import './SearchPreview.scss';
import {Routes} from '../../../constants/routes';
import RouteHelper from '../../../helpers/RouteHelper';
import Image from '../../image/Image';
import {AuthContext} from '../../AuthProvider';

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

                <div className='info-block'>
                    <span onClick={this.onUserClick}>
                        {user.name}
                    </span>
                    {this.props.user.id !== this.context.currentUser.id &&
                    <button onClick={this.props.onChallenge}>
                        To challenge
                    </button>
                    }
                </div>
            </div>
        );
    }
}

SearchPreview.contextType = AuthContext;

export default withRouter(SearchPreview)
