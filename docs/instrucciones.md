# Primeros pasos

Este documento describe cómo preparar el entorno de desarrollo y comenzar a trabajar en el repositorio de Abacontex.

---

# Requisitos previos

Antes de comenzar, asegurarse de tener instalado:

* Docker Desktop
* Git
* Node.js

---

# 1. Empezar a trabajar
Para empezar a trabajar se debe:

1. Clonar repositorio
2. Abrir Docker Desktop (Para que reconozca los comandos)
3. Generar .env con el comando:
```text
cp .env.example .env
```
4. Modificar datos de .env según entorno (Viene para desarrollo por defecto)
5. Levantar docker-compose con el comando:
```text
docker compose up
```
6. Esperar unos segundos y revisar que se hayan leventado los servicios correctamente
```text
URL                     (Por defecto)
http://localhost:5173/  (Frontend)
http://localhost:8080/  (Keycloak)
http://localhost:3000/  (Backend)
(La base de datos no se puede ver con navegador)
```

## 1.1 Reiniciar entorno Docker

Si el entorno queda en un estado inconsistente o se desea comenzar desde cero, se pueden eliminar los contenedores y volúmenes utilizando:

```text
docker compose down -v
```
⚠️ Este comando elimina los datos persistidos en los volúmenes del proyecto, incluyendo la base de datos PostgreSQL y la configuración almacenada en Keycloak.

Una vez finalizado, el entorno puede levantarse nuevamente con:
```text
docker compose up --build
```

# 2. Desarrollo
Una vez se tenga lo básico para empezar a trabajar, se hará el desarrollo de funcionalidades de la siguiente manera:

1. Posicionarse en rama "develop", hacer pull y luego crear rama feature/* o fix/* según necesidad.
2. Una vez posicionados en la nueva rama, realizar las modificaciones que sean necesarias.
3. Se pueden realizar commits en cualquier momento con los avances, pero hay que tener en cuenta que existen validaciones para cuando se desee hacer pull request.
4. Cuando se termina de desarrollar, conviene ejecutar todas las validaciones localmente, antes de llegar a las validaciones que hará Github, para no crear commits todo el tiempo con cada correción. Esto se hace con el comando: 
```text
npm run check
```
4. Corregir los errores identificados por el comando previo. Repetir hasta que se ejecute por completo.
5. Una vez se ejecute sin errores, crear Pull Request hacia rama Develop.
6. Github realizará dichas validaciones y solo dejará mergear si todas pasan sin problema.

## 2.1. Validaciones
Las validaciones que se ejecutan para poder integrar el código son:
1. Lint: Analiza el código fuente para detectar errores potenciales, malas prácticas y problemas de calidad.
2. Tests: Ejecuta los test unitarios y de integración.
3. Formatting: Verifica que el código cumpla con las convenciones de formato definidas para el proyecto.
4. Build: Comprueba que la aplicación pueda generar los artefactos necesarios para su ejecución.

# 3. Testing (Staging)
1. Clonar repositorio
2. Abrir Docker Desktop (Para que reconozca los comandos)
3. Generar .env con el comando:
```text
cp .env.example .env
```

4. Modificar datos de .env para entorno de staging. 
Asegurarse de tener los tags configurados con la última versión disponible para testing (Entre otros):
```text
FRONTEND_PORT=80

BACKEND_TAG=staging
FRONTEND_TAG=staging
```

5. Descargar las últimas imágenes publicadas
```text
docker compose -f .\docker-compose.test.yml pull
```

6. Levantar docker-compose de staging
```text
docker compose -f .\docker-compose.test.yml up
```

7. Esperar unos segundos y revisar que se hayan leventado los servicios correctamente
```text
URL                     (Por defecto)
http://localhost:5173/  (Frontend)
http://localhost:8080/  (Keycloak)
http://localhost:3000/  (Backend)
(La base de datos no se puede ver con navegador)
```

## 3.1. Reiniciar entorno de testing

Si el entorno queda en un estado inconsistente:

```text
docker compose -f .\docker-compose.test.yml down -v
```
⚠️ Este comando elimina los datos persistidos de PostgreSQL y Keycloak.