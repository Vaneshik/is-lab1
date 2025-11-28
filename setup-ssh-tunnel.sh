#!/bin/bash

FRONTEND_SERVER="${FRONTEND_SERVER:-213.21.252.60}"
FRONTEND_USER="${FRONTEND_USER:-root}"

cat > /tmp/tunnel.sh << 'EOF'
#!/bin/bash

HELIOS_USER="s409858"
HELIOS_HOST="se.ifmo.ru"
HELIOS_PORT="2222"
LOCAL_PORT="31337"
REMOTE_PORT="31337"

pkill -f "ssh.*${HELIOS_HOST}.*${LOCAL_PORT}:localhost:${REMOTE_PORT}" 2>/dev/null || true
sleep 2

if lsof -Pi :${LOCAL_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    lsof -ti :${LOCAL_PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
fi

ssh -f -N \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    -o ExitOnForwardFailure=yes \
    -L ${LOCAL_PORT}:localhost:${REMOTE_PORT} \
    -p ${HELIOS_PORT} \
    ${HELIOS_USER}@${HELIOS_HOST}

if [ $? -eq 0 ]; then
    echo "Tunnel: OK"
    sleep 2
    curl -s http://localhost:${LOCAL_PORT}/person-management-system/api/persons > /dev/null
    if [ $? -eq 0 ]; then
        echo "Backend: OK"
    fi
else
    echo "Tunnel: FAILED"
    exit 1
fi
EOF

chmod +x /tmp/tunnel.sh

scp /tmp/tunnel.sh ${FRONTEND_USER}@${FRONTEND_SERVER}:/tmp/
ssh ${FRONTEND_USER}@${FRONTEND_SERVER} "bash /tmp/tunnel.sh"

rm /tmp/tunnel.sh
