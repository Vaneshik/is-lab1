#!/bin/bash

set -e

if [ ! -f .env ]; then
    echo "Ошибка: файл .env не найден"
    echo "Скопируйте ENV.example в .env и заполните значения"
    exit 1
fi

source .env

# Проверка обязательных переменных
if [ -z "$SSH_USER" ] || [ -z "$SSH_HOST" ]; then
    echo "Ошибка: SSH_USER или SSH_HOST не указаны в .env"
    exit 1
fi

# Устанавливаем дефолтные значения
SSH_PORT=${SSH_PORT:-2222}
APP_NAME=${APP_NAME:-person-management-system}
DB_USER=${DB_USER:-$SSH_USER}

echo "=== Deploy to Helios ==="
echo "User: $SSH_USER@$SSH_HOST:$SSH_PORT"
echo ""

echo "1. Обновляю credentials в persistence.xml..."
# Создаем временную копию
cp src/main/resources/META-INF/persistence.xml src/main/resources/META-INF/persistence.xml.backup

# Заменяем плейсхолдеры
sed -i.tmp "s/YOUR_USERNAME/$DB_USER/g" src/main/resources/META-INF/persistence.xml
sed -i.tmp "s/YOUR_PASSWORD/$DB_PASSWORD/g" src/main/resources/META-INF/persistence.xml
rm -f src/main/resources/META-INF/persistence.xml.tmp

echo "2. Собираю проект..."
mvn clean package -DskipTests

# Восстанавливаем оригинал
mv src/main/resources/META-INF/persistence.xml.backup src/main/resources/META-INF/persistence.xml

WAR_FILE="target/${APP_NAME}.war"

if [ ! -f "$WAR_FILE" ]; then
    echo "Ошибка: WAR файл не найден: $WAR_FILE"
    exit 1
fi

echo "3. Создаю директории на сервере..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "mkdir -p ~/webapps ~/sql"

echo "4. Копирую WAR файл..."
scp -P $SSH_PORT $WAR_FILE $SSH_USER@$SSH_HOST:~/webapps/

echo "5. Копирую SQL скрипты..."
scp -P $SSH_PORT database-functions.sql test-data.sql $SSH_USER@$SSH_HOST:~/sql/ 2>/dev/null || true

echo "6. Деплой на WildFly..."
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << 'ENDSSH'
# Остановка WildFly
pkill -9 -f wildfly 2>/dev/null || true
sleep 5

# Копирование WAR в deployments
cp ~/webapps/person-management-system.war ~/wildfly-26.1.3/standalone/deployments/

# Запуск WildFly с правильными параметрами
cd ~/wildfly-26.1.3
unset _JAVA_OPTIONS

JAVA_OPTS="-Xms256m -Xmx512m -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.util.concurrent=ALL-UNNAMED --add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.invoke=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED" \
./bin/standalone.sh \
  -b 0.0.0.0 \
  -bmanagement=0.0.0.0 \
  -Dorg.wildfly.io.worker.task-max-threads=8 \
  -Dorg.wildfly.io.worker.io-threads=2 > ~/wildfly.log 2>&1 &

echo "WildFly запущен (PID: $!)"
echo "Ожидание запуска (40 сек)..."
sleep 40

# Проверка
curl -s http://localhost:31337/person-management-system/api/persons > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ API отвечает корректно"
else
    echo "✗ API не отвечает, проверьте логи: tail -f ~/wildfly.log"
fi
ENDSSH

echo ""
echo "=== Деплой завершен! ==="
echo ""
echo "API: http://${SSH_HOST}:31337/person-management-system/api"
echo "Логи: ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'tail -f ~/wildfly.log'"
echo ""
echo "Проверка API:"
echo "  curl http://${SSH_HOST}:31337/person-management-system/api/persons"
