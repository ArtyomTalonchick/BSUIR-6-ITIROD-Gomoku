import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import AuthProvider from './components/AuthProvider';
import App from './components/App';

ReactDOM.render(<AuthProvider><App/></AuthProvider>, document.getElementById('root'));
