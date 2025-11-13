// Конфигурация для подключения к backend
// Backend: деплоится на helios (se.ifmo.ru) по SSH на порт 31337
// Frontend: деплоится на 213.21.252.60 в Docker с nginx на порту 80
// Nginx проксирует запросы /person-management-system/* на localhost:31337 (SSH туннель)

// Backend через nginx proxy
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || window.location.hostname;
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || window.location.port || '80';
const BACKEND_PATH = process.env.REACT_APP_BACKEND_PATH || '/person-management-system/api';

// HTTP URL для REST API
// В production: http://213.21.252.60/person-management-system/api
export const API_BASE_URL = BACKEND_PORT === '80' || BACKEND_PORT === '' 
    ? `http://${BACKEND_HOST}${BACKEND_PATH}`
    : `http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}`;

// WebSocket URL для real-time обновлений  
// В production: ws://213.21.252.60/person-management-system/ws/persons
export const WS_BASE_URL = BACKEND_PORT === '80' || BACKEND_PORT === ''
    ? `ws://${BACKEND_HOST}/person-management-system/ws/persons`
    : `ws://${BACKEND_HOST}:${BACKEND_PORT}/person-management-system/ws/persons`;

// Для локального тестирования используйте .env.local:
// REACT_APP_BACKEND_HOST=localhost
// REACT_APP_BACKEND_PORT=8080
// REACT_APP_BACKEND_PATH=/person-management-system/api

