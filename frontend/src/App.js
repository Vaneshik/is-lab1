import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PersonList from './pages/PersonList';
import PersonForm from './pages/PersonForm';
import Operations from './pages/Operations';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div>
        <nav className="nav">
          <div className="container">
            <h1>Person Management System</h1>
            <div className="nav-links">
              <Link to="/" className="btn btn-primary">Главная</Link>
              <Link to="/persons" className="btn btn-primary">Список</Link>
              <Link to="/persons/new" className="btn btn-success">Добавить</Link>
              <Link to="/operations" className="btn btn-warning">Операции</Link>
            </div>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/persons" element={<PersonList />} />
            <Route path="/persons/new" element={<PersonForm />} />
            <Route path="/persons/:id" element={<PersonForm />} />
            <Route path="/operations" element={<Operations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

