cd src/main/docker
docker-compose up -d
cd ../../../
./mvnw clean package -Pbuild-frontend
java -jar target/teammates-manager-0.0.1-SNAPSHOT.jar
cd src/main/docker
docker-compose down