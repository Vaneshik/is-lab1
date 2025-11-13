import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { personApi } from '../services/api';
import { WS_BASE_URL } from '../config';

function PersonList() {
  const [persons, setPersons] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [filterNationality, setFilterNationality] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const pageSize = 10;
  const wsRef = useRef(null);

  // WebSocket подключение для real-time обновлений
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_BASE_URL);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setWsConnected(true);
        };
        
        ws.onmessage = (event) => {
          const notification = JSON.parse(event.data);
          console.log('Received notification:', notification);
          // Перезагружаем список при любом изменении
          loadPersons();
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setWsConnected(false);
          // Переподключение через 5 секунд
          setTimeout(connectWebSocket, 5000);
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setTimeout(connectWebSocket, 5000);
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPersons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy]);

  const loadPersons = async () => {
    try {
      const response = await personApi.getAll(page, pageSize, filterName, filterNationality, sortBy);
      setPersons(response.data.content);
      setTotalElements(response.data.totalElements);
      setError('');
    } catch (err) {
      console.error('Error loading persons:', err);
      setError('Ошибка загрузки данных. Проверьте подключение к серверу.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этого человека?')) {
      try {
        await personApi.delete(id);
        loadPersons();
      } catch (err) {
        setError('Ошибка удаления');
      }
    }
  };

  const handleFilter = () => {
    setPage(0);
    loadPersons();
  };

  const handleClearFilter = () => {
    setFilterName('');
    setFilterNationality('');
    setSortBy('');
    setPage(0);
    setTimeout(loadPersons, 0);
  };

  const handleSort = (field) => {
    setSortBy(field);
    setPage(0);
  };

  return (
    <div>
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Список людей</h2>
          <div style={{fontSize: '12px', color: wsConnected ? '#28a745' : '#dc3545'}}>
            {wsConnected ? '● Подключено (Real-time)' : '○ Не подключено'}
          </div>
        </div>
        
        {error && <div className="error">{error}</div>}

        <div className="filter-section">
          <div className="form-group">
            <label>Фильтр по имени</label>
            <input 
              value={filterName} 
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Введите имя"
            />
          </div>
          
          <div className="form-group">
            <label>Фильтр по национальности</label>
            <select value={filterNationality} onChange={(e) => setFilterNationality(e.target.value)}>
              <option value="">Все</option>
              <option value="GERMANY">GERMANY</option>
              <option value="FRANCE">FRANCE</option>
              <option value="SPAIN">SPAIN</option>
              <option value="VATICAN">VATICAN</option>
            </select>
          </div>

          <div className="form-group">
            <label>Сортировка</label>
            <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
              <option value="">По умолчанию (ID)</option>
              <option value="name">По имени</option>
              <option value="creationDate">По дате создания</option>
              <option value="height">По росту</option>
              <option value="weight">По весу</option>
            </select>
          </div>

          <button onClick={handleFilter} className="btn btn-primary">Применить</button>
          <button onClick={handleClearFilter} className="btn">Сбросить</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Координаты</th>
              <th>Дата</th>
              <th>Цвет глаз</th>
              <th>Цвет волос</th>
              <th>Рост</th>
              <th>Вес</th>
              <th>Национальность</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {persons.map(person => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>{person.name}</td>
                <td>({person.coordinates?.x}, {person.coordinates?.y})</td>
                <td>{new Date(person.creationDate).toLocaleDateString()}</td>
                <td>{person.eyeColor}</td>
                <td>{person.hairColor || '-'}</td>
                <td>{person.height || '-'}</td>
                <td>{person.weight || '-'}</td>
                <td>{person.nationality || '-'}</td>
                <td>
                  <div className="actions">
                    <Link to={`/persons/${person.id}`} className="btn btn-warning">Изменить</Link>
                    <button onClick={() => handleDelete(person.id)} className="btn btn-danger">Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 0}
            className="btn btn-primary"
          >
            Назад
          </button>
          <span>Страница {page + 1} (Всего: {totalElements})</span>
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={(page + 1) * pageSize >= totalElements}
            className="btn btn-primary"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonList;

