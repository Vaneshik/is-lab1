#!/bin/bash

# Скрипт для развертывания frontend в Docker на сервере 213.21.252.60
# Backend остается на helios (se.ifmo.ru)

set -e  # Выход при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
FRONTEND_SERVER="213.21.252.60"
FRONTEND_USER="${FRONTEND_USER:-root}"  # По умолчанию root, можно изменить
FRONTEND_PORT="${FRONTEND_PORT:-22}"
REMOTE_DIR="/opt/person-management-frontend"
CONTAINER_NAME="person-management-frontend"
IMAGE_NAME="person-management-frontend:latest"

echo -e "${GREEN}=== Развертывание Frontend в Docker ===${NC}"
echo "Сервер: $FRONTEND_SERVER"
echo "Пользователь: $FRONTEND_USER"
echo ""

# Проверка наличия SSH ключа или запрос пароля
echo -e "${YELLOW}[1/6] Проверка подключения к серверу...${NC}"
if ! ssh -p $FRONTEND_PORT -o ConnectTimeout=5 $FRONTEND_USER@$FRONTEND_SERVER "echo 'OK'" > /dev/null 2>&1; then
    echo -e "${RED}Ошибка: не удается подключиться к серверу${NC}"
    echo "Убедитесь, что:"
    echo "  - Сервер доступен"
    echo "  - SSH ключ настроен или введите пароль при запросе"
    echo "  - Переменные FRONTEND_USER и FRONTEND_PORT корректны"
    exit 1
fi
echo -e "${GREEN}✓ Подключение успешно${NC}"

# Переходим в директорию frontend
cd frontend

# Создаем production .env если его нет
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}[2/6] Создание .env.production...${NC}"
    cat > .env.production << EOF
REACT_APP_BACKEND_HOST=se.ifmo.ru
REACT_APP_BACKEND_PORT=8080
REACT_APP_BACKEND_PATH=/person-management-system/api
EOF
    echo -e "${GREEN}✓ .env.production создан${NC}"
else
    echo -e "${GREEN}[2/6] .env.production уже существует${NC}"
fi

# Создаем архив с необходимыми файлами
echo -e "${YELLOW}[3/6] Создание архива для отправки...${NC}"
tar -czf ../frontend-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='build' \
    --exclude='.git' \
    --exclude='coverage' \
    .
echo -e "${GREEN}✓ Архив создан${NC}"

cd ..

# Копируем архив на сервер
echo -e "${YELLOW}[4/6] Копирование файлов на сервер...${NC}"
scp -P $FRONTEND_PORT frontend-deploy.tar.gz $FRONTEND_USER@$FRONTEND_SERVER:/tmp/
echo -e "${GREEN}✓ Файлы скопированы${NC}"

# Разворачиваем на сервере
echo -e "${YELLOW}[5/6] Развертывание Docker контейнера...${NC}"
ssh -p $FRONTEND_PORT $FRONTEND_USER@$FRONTEND_SERVER << 'ENDSSH'
set -e

# Создаем директорию для приложения
mkdir -p /opt/person-management-frontend
cd /opt/person-management-frontend

# Распаковываем архив
tar -xzf /tmp/frontend-deploy.tar.gz
rm /tmp/frontend-deploy.tar.gz

# Останавливаем и удаляем старый контейнер если существует
if docker ps -a | grep -q person-management-frontend; then
    echo "Останавливаем старый контейнер..."
    docker stop person-management-frontend || true
    docker rm person-management-frontend || true
fi

# Удаляем старый образ если существует
if docker images | grep -q person-management-frontend; then
    echo "Удаляем старый образ..."
    docker rmi person-management-frontend:latest || true
fi

# Собираем новый образ
echo "Сборка Docker образа..."
docker build -t person-management-frontend:latest .

# Запускаем контейнер с host network для доступа к localhost:31337 (SSH туннель)
echo "Запуск контейнера..."
docker run -d \
    --name person-management-frontend \
    --restart unless-stopped \
    --network host \
    -e REACT_APP_BACKEND_HOST=se.ifmo.ru \
    -e REACT_APP_BACKEND_PORT=31337 \
    -e REACT_APP_BACKEND_PATH=/person-management-system/api \
    person-management-frontend:latest

echo "Контейнер запущен!"

# Проверка статуса
sleep 3
if docker ps | grep -q person-management-frontend; then
    echo "✓ Контейнер работает"
    docker ps | grep person-management-frontend
else
    echo "✗ Ошибка: контейнер не запустился"
    docker logs person-management-frontend
    exit 1
fi

ENDSSH

echo -e "${GREEN}✓ Контейнер развернут${NC}"

# Очистка локального архива
echo -e "${YELLOW}[6/6] Очистка временных файлов...${NC}"
rm -f frontend-deploy.tar.gz
echo -e "${GREEN}✓ Очистка выполнена${NC}"

echo ""
echo -e "${GREEN}=== Развертывание завершено успешно! ===${NC}"
echo ""
echo "Frontend доступен по адресу: http://$FRONTEND_SERVER"
echo "Backend работает на: http://se.ifmo.ru:8080/person-management-system/api"
echo ""
echo "Проверка:"
echo "  curl http://$FRONTEND_SERVER/health"
echo ""
echo "Логи контейнера:"
echo "  ssh $FRONTEND_USER@$FRONTEND_SERVER 'docker logs -f person-management-frontend'"
echo ""
echo "Управление контейнером:"
echo "  Остановить:  ssh $FRONTEND_USER@$FRONTEND_SERVER 'docker stop person-management-frontend'"
echo "  Запустить:   ssh $FRONTEND_USER@$FRONTEND_SERVER 'docker start person-management-frontend'"
echo "  Перезапуск:  ssh $FRONTEND_USER@$FRONTEND_SERVER 'docker restart person-management-frontend'"
echo ""

