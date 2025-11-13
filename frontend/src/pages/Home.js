import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          ✨🌸💖
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          marginBottom: '1rem'
        }}>
          Anime Waifu Database
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#ffc0cb',
          marginBottom: '2rem',
          lineHeight: 1.6
        }}>
          Добро пожаловать в kawaii систему управления аниме персонажами! (◕‿◕)♡
          <br/>
          Создавай, редактируй и управляй своими любимыми waifu!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <Link to="/persons" style={{ textDecoration: 'none', height: '100%' }}>
            <div className="card" style={{
              padding: '1.5rem',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👧</div>
              <h3 style={{ margin: '0.5rem 0' }}>Список Waifu</h3>
              <p style={{ fontSize: '0.9rem', color: '#ddd', textAlign: 'center' }}>
                Просмотр всех персонажей
              </p>
            </div>
          </Link>

          <Link to="/persons/new" style={{ textDecoration: 'none', height: '100%' }}>
            <div className="card" style={{
              padding: '1.5rem',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>➕</div>
              <h3 style={{ margin: '0.5rem 0' }}>Добавить Waifu</h3>
              <p style={{ fontSize: '0.9rem', color: '#ddd', textAlign: 'center' }}>
                Создать нового персонажа
              </p>
            </div>
          </Link>

          <Link to="/operations" style={{ textDecoration: 'none', height: '100%' }}>
            <div className="card" style={{
              padding: '1.5rem',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
              <h3 style={{ margin: '0.5rem 0' }}>Операции</h3>
              <p style={{ fontSize: '0.9rem', color: '#ddd', textAlign: 'center' }}>
                Специальные функции
              </p>
            </div>
          </Link>
        </div>

        <div style={{ marginTop: '3rem', fontSize: '2rem' }}>
          🌸 💕 ⭐ 💖 🌸
        </div>

        <p style={{ 
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#888',
          fontStyle: 'italic'
        }}>
          Made with 💖 and lots of anime
        </p>
      </div>
    </div>
  );
}

export default Home;
