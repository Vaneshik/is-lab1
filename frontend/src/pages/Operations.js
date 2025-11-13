import React, { useState, useEffect } from 'react';
import { operationsApi, locationApi } from '../services/api';

function Operations() {
  const [locations, setLocations] = useState([]);
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await locationApi.getAll();
      setLocations(response.data);
    } catch (err) {
      console.error('Error loading locations');
    }
  };

  const handleDeleteByNationality = async (e) => {
    e.preventDefault();
    const nationality = e.target.nationality.value;
    if (!nationality) return;
    
    if (window.confirm(`Удалить всех людей с национальностью ${nationality}?`)) {
      try {
        await operationsApi.deleteByNationality(nationality);
        setSuccess('Удалено успешно');
        setError('');
      } catch (err) {
        setError('Ошибка удаления');
      }
    }
  };

  const handleAverageHeight = async () => {
    try {
      const response = await operationsApi.getAverageHeight();
      setResults({...results, avgHeight: response.data.averageHeight});
      setSuccess('Рассчитано');
      setError('');
    } catch (err) {
      setError('Ошибка расчета');
    }
  };

  const handleUniqueNationalities = async () => {
    try {
      const response = await operationsApi.getUniqueNationalities();
      setResults({...results, nationalities: response.data});
      setSuccess('Получено');
      setError('');
    } catch (err) {
      setError('Ошибка получения данных');
    }
  };

  const handleHairColorPercentage = async (e) => {
    e.preventDefault();
    const color = e.target.color.value;
    if (!color) return;

    try {
      const response = await operationsApi.getHairColorPercentage(color);
      setResults({...results, percentage: response.data.percentage});
      setSuccess('Рассчитано');
      setError('');
    } catch (err) {
      setError('Ошибка расчета');
    }
  };

  const handleCountByLocation = async (e) => {
    e.preventDefault();
    const color = e.target.color.value;
    const locationId = e.target.location.value;
    if (!color) return;

    try {
      const response = await operationsApi.countByLocation(color, locationId);
      setResults({...results, count: response.data.count});
      setSuccess('Подсчитано');
      setError('');
    } catch (err) {
      setError('Ошибка подсчета');
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Специальные операции</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="card" style={{marginTop: '20px'}}>
          <h3>1. Удалить по национальности</h3>
          <form onSubmit={handleDeleteByNationality}>
            <div style={{display: 'flex', gap: '10px', alignItems: 'end'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Национальность</label>
                <select name="nationality">
                  <option value="">Выберите...</option>
                  <option value="GERMANY">GERMANY</option>
                  <option value="FRANCE">FRANCE</option>
                  <option value="SPAIN">SPAIN</option>
                  <option value="VATICAN">VATICAN</option>
                </select>
              </div>
              <button type="submit" className="btn btn-danger">Удалить</button>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>2. Среднее значение роста</h3>
          <button onClick={handleAverageHeight} className="btn btn-primary">Рассчитать</button>
          {results.avgHeight !== undefined && (
            <p style={{marginTop: '10px'}}>Результат: {results.avgHeight.toFixed(2)} см</p>
          )}
        </div>

        <div className="card">
          <h3>3. Уникальные национальности</h3>
          <button onClick={handleUniqueNationalities} className="btn btn-primary">Получить список</button>
          {results.nationalities && (
            <ul style={{marginTop: '10px'}}>
              {results.nationalities.map((nat, idx) => (
                <li key={idx}>{nat}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>4. Доля людей с цветом волос (%)</h3>
          <form onSubmit={handleHairColorPercentage}>
            <div style={{display: 'flex', gap: '10px', alignItems: 'end'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Цвет волос</label>
                <select name="color">
                  <option value="">Выберите...</option>
                  <option value="GREEN">GREEN</option>
                  <option value="BLACK">BLACK</option>
                  <option value="BLUE">BLUE</option>
                  <option value="WHITE">WHITE</option>
                  <option value="BROWN">BROWN</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Рассчитать</button>
            </div>
          </form>
          {results.percentage !== undefined && (
            <p style={{marginTop: '10px'}}>Результат: {results.percentage.toFixed(2)}%</p>
          )}
        </div>

        <div className="card">
          <h3>5. Количество по цвету волос и локации</h3>
          <form onSubmit={handleCountByLocation}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
              <div className="form-group">
                <label>Цвет волос</label>
                <select name="color">
                  <option value="">Выберите...</option>
                  <option value="GREEN">GREEN</option>
                  <option value="BLACK">BLACK</option>
                  <option value="BLUE">BLUE</option>
                  <option value="WHITE">WHITE</option>
                  <option value="BROWN">BROWN</option>
                </select>
              </div>
              <div className="form-group">
                <label>Локация</label>
                <select name="location">
                  <option value="">Все локации</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name || `Location ${loc.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>Подсчитать</button>
          </form>
          {results.count !== undefined && (
            <p style={{marginTop: '10px'}}>Результат: {results.count} человек</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Operations;

