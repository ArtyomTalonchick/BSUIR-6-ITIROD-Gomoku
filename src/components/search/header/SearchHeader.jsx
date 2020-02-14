import React from 'react';

import './SearchHeader.scss';

export default class SearchHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchValue: ''
        }
    }

    onInputChange = event => this.setState({searchValue: event.target.value});

    onSubmit = event => {
        event.preventDefault();
        this.props.onSubmit(this.state.searchValue);
    };

    render() {
        return (
            <form className='search-header-container' onSubmit={this.onSubmit}>
                <div className='input-container'>
                    <i className='fa fa-search'/>
                    <input
                        className='search-input'
                        placeholder='Search...'
                        value={this.state.searchValue}
                        onChange={this.onInputChange}
                    />
                </div>
                <button type='submit'>Search</button>
            </form>
        );
    }
}
