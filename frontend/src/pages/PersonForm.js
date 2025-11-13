import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { personApi, locationApi } from '../services/api';

function PersonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [person, setPerson] = useState({
    name: '',
    coordinates: { x: 0, y: 0 },
    eyeColor: 'BLUE',
    hairColor: '',
    height: '',
    weight: '',
    passportID: '',
    nationality: '',
    location: null
  });

  useEffect(() => {
    loadLocations();
    if (id) {
      loadPerson();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadLocations = async () => {
    try {
      const response = await locationApi.getAll();
      setLocations(response.data);
    } catch (err) {
      console.error('Error loading locations');
    }
  };

  const loadPerson = async () => {
    try {
      const response = await personApi.getById(id);
      setPerson(response.data);
    } catch (err) {
      setError('Ошибка загрузки данных');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await personApi.update(id, person);
      } else {
        await personApi.create(person);
      }
      navigate('/persons');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPerson({
        ...person,
        [parent]: { ...person[parent], [child]: value }
      });
    } else {
      setPerson({ ...person, [field]: value });
    }
  };

  return (
    <div className="card">
      <h2>{id ? 'Редактировать' : 'Добавить'} человека</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя *</label>
          <input 
            required
            value={person.name} 
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Координата X * (макс. 454)</label>
            <input 
              type="number" 
              required
              max="454"
              value={person.coordinates.x} 
              onChange={(e) => handleChange('coordinates.x', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Координата Y * (макс. 698)</label>
            <input 
              type="number" 
              required
              max="698"
              value={person.coordinates.y} 
              onChange={(e) => handleChange('coordinates.y', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Цвет глаз *</label>
            <select 
              required
              value={person.eyeColor} 
              onChange={(e) => handleChange('eyeColor', e.target.value)}
            >
              <option value="GREEN">GREEN</option>
              <option value="BLACK">BLACK</option>
              <option value="BLUE">BLUE</option>
              <option value="WHITE">WHITE</option>
              <option value="BROWN">BROWN</option>
            </select>
          </div>

          <div className="form-group">
            <label>Цвет волос</label>
            <select 
              value={person.hairColor} 
              onChange={(e) => handleChange('hairColor', e.target.value)}
            >
              <option value="">Не указан</option>
              <option value="GREEN">GREEN</option>
              <option value="BLACK">BLACK</option>
              <option value="BLUE">BLUE</option>
              <option value="WHITE">WHITE</option>
              <option value="BROWN">BROWN</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Рост (см)</label>
            <input 
              type="number" 
              min="1"
              value={person.height} 
              onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : '')}
            />
          </div>

          <div className="form-group">
            <label>Вес (кг)</label>
            <input 
              type="number" 
              step="0.1"
              min="0.1"
              value={person.weight} 
              onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : '')}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Паспорт ID</label>
          <input 
            value={person.passportID} 
            onChange={(e) => handleChange('passportID', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Национальность</label>
          <select 
            value={person.nationality} 
            onChange={(e) => handleChange('nationality', e.target.value)}
          >
            <option value="">Не указана</option>
            <option value="GERMANY">GERMANY</option>
            <option value="FRANCE">FRANCE</option>
            <option value="SPAIN">SPAIN</option>
            <option value="VATICAN">VATICAN</option>
          </select>
        </div>

        <div className="form-group">
          <label>Локация</label>
          <select 
            value={person.location?.id || ''} 
            onChange={(e) => {
              const loc = locations.find(l => l.id === parseInt(e.target.value));
              handleChange('location', loc || null);
            }}
          >
            <option value="">Не указана</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name || `Location ${loc.id}`} ({loc.x}, {loc.y}, {loc.z})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-success">Сохранить</button>
          <button type="button" onClick={() => navigate('/persons')} className="btn">Отмена</button>
        </div>
      </form>
    </div>
  );
}

export default PersonForm;

