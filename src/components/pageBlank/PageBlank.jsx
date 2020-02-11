import React from 'react';

import './PageBlank.scss';

export default class PageBlank extends React.Component {

    render() {
        return (
            <div className='page-blank-container'>
                {this.props.children}
            </div>
        );
    }
}
