# Imagen base con Java 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el wrapper de Maven y el pom
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Descargamos dependencias para acelerar builds posteriores
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

# Copiamos el código fuente
COPY src src

# Construimos el JAR (sin tests para que sea más rápido)
RUN ./mvnw -q package -DskipTests

# Render usa la variable de entorno PORT
ENV PORT=8080

# Exponemos el puerto por defecto
EXPOSE 8080

# Ejecutamos el JAR generado aaa
CMD ["sh", "-c", "java -jar target/*.jar"]
