#!/bin/bash
set -e

echo "=== Deploy Backend ==="
if [ -f deploy-helios.sh ]; then
    ./deploy-helios.sh
else
    echo "Ошибка: deploy-helios.sh не найден"
    exit 1
fi

echo ""
echo "=== Deploy Frontend ==="
if [ -f deploy-frontend-docker.sh ]; then
    ./deploy-frontend-docker.sh
else
    echo "Ошибка: deploy-frontend-docker.sh не найден"
    exit 1
fi

echo ""
echo "=== Deploy complete ==="
echo "Frontend: http://213.21.252.60"
echo "Backend: http://se.ifmo.ru:31337/person-management-system/api"
