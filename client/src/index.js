import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import AppRoot from './AppRoot';

ReactDOM.render(<CookiesProvider><AppRoot /></CookiesProvider>, document.getElementById('root'));
