#!/bin/bash
# Скрипт для настройки SSH туннеля на сервере 213.21.252.60
# Туннель: 213.21.252.60:31337 -> helios:31337

FRONTEND_SERVER="${FRONTEND_SERVER:-213.21.252.60}"
FRONTEND_USER="${FRONTEND_USER:-root}"

echo "=== Настройка SSH туннеля на $FRONTEND_SERVER ==="
echo ""

# Создаем скрипт туннеля на удаленном сервере
cat > /tmp/tunnel.sh << 'EOF'
#!/bin/bash

# Параметры
HELIOS_USER="s409858"
HELIOS_HOST="se.ifmo.ru"
HELIOS_PORT="2222"
LOCAL_PORT="31337"
REMOTE_PORT="31337"

# Убиваем старый туннель если есть
echo "Останавливаю старые туннели..."
pkill -f "ssh.*${HELIOS_HOST}.*${LOCAL_PORT}:localhost:${REMOTE_PORT}" 2>/dev/null || true
sleep 2

# Проверяем, занят ли порт
if lsof -Pi :${LOCAL_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠ Порт ${LOCAL_PORT} все еще занят, пытаюсь освободить..."
    lsof -ti :${LOCAL_PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo "Создаю SSH туннель: localhost:${LOCAL_PORT} -> ${HELIOS_HOST}:${REMOTE_PORT}"

# Создаем туннель
ssh -f -N \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    -o ExitOnForwardFailure=yes \
    -L ${LOCAL_PORT}:localhost:${REMOTE_PORT} \
    -p ${HELIOS_PORT} \
    ${HELIOS_USER}@${HELIOS_HOST}

if [ $? -eq 0 ]; then
    echo "✓ Туннель создан успешно"
    echo ""
    echo "Проверка:"
    sleep 2
    curl -s http://localhost:${LOCAL_PORT}/person-management-system/api/persons > /dev/null
    if [ $? -eq 0 ]; then
        echo "✓ Backend доступен через туннель"
    else
        echo "⚠ Backend пока не отвечает (возможно еще загружается)"
    fi
else
    echo "✗ Ошибка создания туннеля"
    exit 1
fi

# Проверяем туннель
ps aux | grep "ssh.*${HELIOS_HOST}" | grep -v grep

echo ""
echo "Туннель работает в фоновом режиме"
echo "Для остановки: pkill -f 'ssh.*${HELIOS_HOST}.*${LOCAL_PORT}'"
EOF

chmod +x /tmp/tunnel.sh

# Копируем скрипт на сервер
echo "Копирую скрипт на сервер..."
scp /tmp/tunnel.sh ${FRONTEND_USER}@${FRONTEND_SERVER}:/tmp/

# Запускаем на сервере
echo "Запускаю туннель..."
ssh ${FRONTEND_USER}@${FRONTEND_SERVER} "bash /tmp/tunnel.sh"

rm /tmp/tunnel.sh

echo ""
echo "=== Готово! ==="
echo ""
echo "Теперь frontend на 213.21.252.60 будет ходить на localhost:31337,"
echo "который проксируется на helios:31337 через SSH туннель"
echo ""
echo "Проверка туннеля на сервере:"
echo "  ssh ${FRONTEND_USER}@${FRONTEND_SERVER} 'ps aux | grep ssh | grep ${HELIOS_HOST}'"
echo ""

