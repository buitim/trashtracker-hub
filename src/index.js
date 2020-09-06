import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './views/App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const rootEl = document.getElementById('root');

ReactDOM.render(
    <App />,
    rootEl
)

if (module.hot) {
    module.hot.accept('./views/App.js', () => {
        const NextApp = require('./views/App.js').default
        ReactDOM.render(
            <NextApp />,
            rootEl
        )
    })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
