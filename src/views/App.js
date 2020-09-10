import React from 'react';
import '../styles/App.css';
import MainContainer from '../containers/MainContainer';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
    return (
        <Router>
            <MainContainer />
        </Router>
    );
}

export default App;
