import React from 'react';

import './Image.scss';
import Loader from '../loader/Loader';
import DefaultImage from '../../images/DefaultImage.png';

export default class Image extends React.Component {

    constructor(props) {
        super(props);

        this.imgRef = React.createRef();
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this.updateLoadingStatus();
    }


    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateLoadingStatus();
        }
    }

    updateLoadingStatus = () => this.setState({loading: !this.imgRef.current?.complete || this.props.loading});

    getStyle = () => ({height: this.props.height, width: this.props.width});

    render() {
        return (
            <div className='image-container' style={this.getStyle()}>
                {this.state.loading && <Loader/>}
                <img
                    ref={this.imgRef}
                    src={this.props.src || DefaultImage}
                    onLoad={this.updateLoadingStatus}
                    className={this.state.loading ? 'hidden' : ''}
                />
            </div>
        );
    }
}
