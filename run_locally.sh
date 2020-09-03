echo "Starting Teammates Manager"

CONTAINER_ID=`docker ps -f "name=teammates-manager-db" -q`
if [ -z "$CONTAINER_ID" ]
then
  echo "Starting MySQL database"
  cd src/main/docker
  docker-compose up -d
  cd ../../../
  CONTAINER_ID=`docker ps -f "name=teammates-manager-db" -q`
else
  echo "Database already running"
fi

echo "Getting container network settings"
CONTAINER_IP=`docker inspect -f '{{ (index (index .NetworkSettings.Ports "3306/tcp") 0).HostIp }}' $CONTAINER_ID`
CONTAINER_PORT=`docker inspect -f '{{ (index (index .NetworkSettings.Ports "3306/tcp") 0).HostPort }}' $CONTAINER_ID`
DB_URL='jdbc:mysql://attsw:attsw@'$CONTAINER_IP':'$CONTAINER_PORT'/teammates-manager'

echo "Setting up Application"
./mvnw clean package -Pbuild-frontend
java -Dspring.profiles.active=prod -Dspring.datasource.url="$DB_URL" -jar target/*.jar