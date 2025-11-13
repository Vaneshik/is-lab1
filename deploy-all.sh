#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Развертывание Person Management System                ║"
echo "║  Backend  → helios (se.ifmo.ru)                           ║"
echo "║  Frontend → Docker (213.21.252.60)                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}═══ ШАГ 1/2: Развертывание Backend на helios ═══${NC}"
echo ""
if [ -f deploy-helios.sh ]; then
    ./deploy-helios.sh
else
    echo -e "${RED}Ошибка: deploy-helios.sh не найден${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Backend развернут на helios${NC}"
echo ""
sleep 2

echo -e "${YELLOW}═══ ШАГ 2/2: Развертывание Frontend в Docker ═══${NC}"
echo ""
if [ -f deploy-frontend-docker.sh ]; then
    ./deploy-frontend-docker.sh
else
    echo -e "${RED}Ошибка: deploy-frontend-docker.sh не найден${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Frontend развернут в Docker${NC}"
echo ""

# Финальная информация
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${GREEN}Frontend:${NC} http://213.21.252.60"
echo -e "${GREEN}Backend:${NC}  http://se.ifmo.ru:31337/person-management-system/api"
echo ""
echo -e "${YELLOW}Проверка работоспособности:${NC}"
echo "  curl http://213.21.252.60/health"
echo "  curl http://se.ifmo.ru:31337/person-management-system/api/persons"
echo ""
echo -e "${YELLOW}Логи:${NC}"
echo "  Frontend: ssh root@213.21.252.60 'docker logs -f person-management-frontend'"
echo "  Backend:  ssh на helios → проверить логи Tomcat/Wildfly"
echo ""

