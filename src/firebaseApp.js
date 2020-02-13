import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'

import {firebaseConfig} from './constants/firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
