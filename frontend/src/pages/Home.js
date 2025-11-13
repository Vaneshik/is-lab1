import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="card">
      <h2>Добро пожаловать в систему управления</h2>
      <p style={{ marginTop: '20px', marginBottom: '30px' }}>
        Информационная система для управления объектами Person
      </p>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <Link to="/persons" className="btn btn-primary">
          Просмотреть список людей
        </Link>
        <Link to="/persons/new" className="btn btn-success">
          Добавить нового человека
        </Link>
        <Link to="/operations" className="btn btn-warning">
          Специальные операции
        </Link>
      </div>
    </div>
  );
}

export default Home;

