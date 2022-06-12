import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './features/User/Login';
import Signup from './features/User/Signup';
import Dashboard from './features/User/Dashboard';
import { PrivateRoute } from './helpers/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <PrivateRoute path="/" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
