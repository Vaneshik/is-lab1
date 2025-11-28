#!/bin/bash

set -e

FRONTEND_SERVER="213.21.252.60"
FRONTEND_USER="${FRONTEND_USER:-root}"
FRONTEND_PORT="${FRONTEND_PORT:-22}"
REMOTE_DIR="/opt/person-management-frontend"
CONTAINER_NAME="person-management-frontend"
IMAGE_NAME="person-management-frontend:latest"

if ! ssh -p $FRONTEND_PORT -o ConnectTimeout=5 $FRONTEND_USER@$FRONTEND_SERVER "echo 'OK'" > /dev/null 2>&1; then
    echo "Ошибка: не удается подключиться к серверу"
    exit 1
fi

cd frontend

if [ ! -f .env.production ]; then
    cat > .env.production << EOF
REACT_APP_BACKEND_HOST=se.ifmo.ru
REACT_APP_BACKEND_PORT=8080
REACT_APP_BACKEND_PATH=/person-management-system/api
EOF
fi

tar -czf ../frontend-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='build' \
    --exclude='.git' \
    --exclude='coverage' \
    .

cd ..

scp -P $FRONTEND_PORT frontend-deploy.tar.gz $FRONTEND_USER@$FRONTEND_SERVER:/tmp/

ssh -p $FRONTEND_PORT $FRONTEND_USER@$FRONTEND_SERVER << 'ENDSSH'
set -e

mkdir -p /opt/person-management-frontend
cd /opt/person-management-frontend

tar -xzf /tmp/frontend-deploy.tar.gz
rm /tmp/frontend-deploy.tar.gz

if docker ps -a | grep -q person-management-frontend; then
    docker stop person-management-frontend || true
    docker rm person-management-frontend || true
fi

if docker images | grep -q person-management-frontend; then
    docker rmi person-management-frontend:latest || true
fi

docker build -t person-management-frontend:latest .

docker run -d \
    --name person-management-frontend \
    --restart unless-stopped \
    --network host \
    -e REACT_APP_BACKEND_HOST=se.ifmo.ru \
    -e REACT_APP_BACKEND_PORT=31337 \
    -e REACT_APP_BACKEND_PATH=/person-management-system/api \
    person-management-frontend:latest

sleep 3
if docker ps | grep -q person-management-frontend; then
    echo "Container: OK"
else
    echo "Container: FAILED"
    exit 1
fi

ENDSSH

rm -f frontend-deploy.tar.gz

echo "Deploy complete"
echo "Frontend: http://$FRONTEND_SERVER"
