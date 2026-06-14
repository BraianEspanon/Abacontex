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
3. Generar .env
```text
cp .env .env.example
```
4. Modificar datos de .env según entorno (Desarrollo por defecto)
5. Levantar docker-compose
```text
docker compose up
```
6. Esperar unos segundos y revisar que se hayan leventado los servicios correctamente
```text
URL                     (Por defecto)
http://localhost:5173/  (Frontend)
http://localhost:8080/  (Keycloak)
http://localhost:3000/  (Backend)
(La base de datos no se puede ver con navegador así)
```

# 2. Desarrollo
Una vez se tenga lo básico para empezar a trabajar, se hará el desarrollo de funcionalidades de la siguiente manera:

1. Posicionarse en rama "develop", hacer pull y luego crear rama feature/* o fix/* según necesidad.
2. Una vez posicionados en la nueva rama, realizar las modificaciones que sean necesarias.
3. Se pueden realizar commits en cualquier momento con los avances, pero hay que tener en cuenta que existen validaciones para luego hacer pull request.
4. Cuando se termina de desarrollar, conviene ejecutar todas las validaciones localmente, antes de llegar a las validaciones que hará Github, para no crear commits todo el tiempo con cada correción. Esto se hace con el comando: 
```text
npm run check
```
4. Corregir los errores identificados por el comando previo. Repetir hasta que se ejecute por completo.
5. Una vez se ejecute sin errores, crear Pull Request hacia rama Develop.
6. Github realizará dichas validaciones y solo dejará mergear si todas pasan sin problema.