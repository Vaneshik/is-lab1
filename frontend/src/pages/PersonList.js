import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { personApi } from '../services/api';
import { WS_BASE_URL } from '../config';

function PersonList() {
  const [persons, setPersons] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [filterNationality, setFilterNationality] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  const loadPersons = async () => {
    try {
      const response = await personApi.getAll(page, pageSize, filterName, filterNationality, sortBy);
      setPersons(response.data.content);
      setTotalElements(response.data.totalElements);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки данных');
    }
  };

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(WS_BASE_URL);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        console.log('WebSocket message:', event.data);
        loadPersons();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  useEffect(() => {
    loadPersons();
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

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этого персонажа?')) {
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
  };

  const handleSort = (field) => {
    setSortBy(field);
    setPage(0);
  };

  const totalPages = Math.ceil(totalElements / pageSize);

  return (
    <div style={{ padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
      <div className="card" style={{ 
        marginBottom: '1.5rem',
        padding: 'clamp(1rem, 3vw, 2rem)'
      }}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            margin: 0 
          }}>
            Список людей 👧
          </h2>
          <span style={{ 
            color: wsConnected ? '#4CAF50' : '#f44336',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px'
          }}>
            {wsConnected ? '● Подключено (Real-time)' : '○ Не подключено'}
          </span>
        </div>
        
        {error && <div className="alert" style={{
          background: 'rgba(244, 67, 54, 0.2)',
          border: '2px solid #f44336',
          color: '#ff6b6b',
          marginBottom: '1rem'
        }}>{error}</div>}

        {/* Фильтры */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              color: '#ffc0cb'
            }}>Фильтр по имени</label>
            <input 
              value={filterName} 
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Введите имя"
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              color: '#ffc0cb'
            }}>Фильтр по национальности</label>
            <select 
              value={filterNationality} 
              onChange={(e) => setFilterNationality(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Все</option>
              <option value="GERMANY">GERMANY</option>
              <option value="FRANCE">FRANCE</option>
              <option value="SPAIN">SPAIN</option>
              <option value="VATICAN">VATICAN</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              color: '#ffc0cb'
            }}>Сортировка</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSort(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">По умолчанию (ID)</option>
              <option value="name">По имени</option>
              <option value="creationDate">По дате создания</option>
              <option value="height">По росту</option>
              <option value="weight">По весу</option>
            </select>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button onClick={handleFilter}>Применить</button>
          <button onClick={handleClearFilter} style={{
            background: 'rgba(255, 255, 255, 0.1)'
          }}>Сбросить</button>
        </div>

        {/* Карточки (для всех экранов) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {persons.map(person => (
            <div key={person.id} className="card" style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 105, 180, 0.2)',
              marginBottom: 0
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.25rem' }}>ID: {person.id}</div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{person.name}</h3>
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#ffc0cb',
                  background: 'rgba(255, 192, 203, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '10px'
                }}>
                  {person.nationality || '-'}
                </div>
              </div>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Координаты</div>
                  <div>({person.coordinates?.x}, {person.coordinates?.y})</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Дата</div>
                  <div>{person.creationDate ? new Date(person.creationDate).toLocaleDateString() : '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Глаза 👀</div>
                  <div>{person.eyeColor || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Волосы 💇</div>
                  <div>{person.hairColor || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Рост 📏</div>
                  <div>{person.height || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Вес ⚖️</div>
                  <div>{person.weight || '-'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/persons/${person.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                  <button style={{ width: '100%' }}>✏️ Изменить</button>
                </Link>
                <button 
                  onClick={() => handleDelete(person.id)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
                  }}
                >🗑️ Удалить</button>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
            Страница {page + 1} (Всего: {totalElements})
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setPage(0)} 
              disabled={page === 0}
              style={{ 
                padding: '0.5rem 1rem',
                opacity: page === 0 ? 0.5 : 1
              }}
            >Назад</button>
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={page >= totalPages - 1}
              style={{ 
                padding: '0.5rem 1rem',
                opacity: page >= totalPages - 1 ? 0.5 : 1
              }}
            >Вперед</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PersonList;
