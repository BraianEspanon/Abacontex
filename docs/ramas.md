# Flujo de Trabajo del Repositorio

## Objetivo

Este documento describe cómo trabajar correctamente en el repositorio de Abacontex, cómo se gestionan los cambios y cómo fluye el código entre las distintas ramas del proyecto.

---

# Estructura de ramas

El proyecto utiliza las siguientes ramas principales:

```text
main
↑
test
↑
develop
↑           ↑
feature/* o fix/*
```

## main
Representa la versión estable del sistema.

A partir de esta rama, se crean los tags de versión (SemVer) usando por ejemplo:
```text
v1.0.0
v1.1.0
v1.2.0
```
Al crear las tags, los builds de docker automáticamente son etiquetados con esta version y con la etiqueta "latest", la cual indica que dicha build es la última versión estable.

---

## test

Representa el entorno de pruebas (staging).

Características:

* Se utiliza para validar funcionalidades antes de llegar a producción.
* Los testers deben trabajar sobre esta versión.
* Debe reflejar fielmente lo que llegará a producción.

Esta rama al recibir cambios, automáticamente crea una build de docker, la cual es etiquetada con el SHA del commit (Identificador único) y con la etiqueta "staging", la cual indica que dicha build es la última versión lista para ser testeada.

A partir de la verificación de errores de esta rama, los cambios son promovidos o no a main.

---

## develop

Representa la rama principal de desarrollo.

Características:

* Es la rama donde se integran nuevas funcionalidades.
* Todas las ramas feature deben partir desde aquí.
* Debe mantenerse estable y funcional.

Al intentar integrar cambios en esta rama, se ejecutarán validaciones para asegurar que todas las ramas que hereden código de acá, como mínimo se ejecuten correctamente y cumplan con las convenciones de codificación.

Dichas validaciones son:
1. Lint: Verifica que no se usen prácticas obsoletas para codificar
2. Tests: Son los test unitarios.
3. Formatting: Verifica que se cumplan con las pautas y convenciones de codificación
4. Build: Valida que el código se pueda compilar

---

## feature/*

Se crean según necesidad, a partir de la rama develop.
Se utiliza para desarrollar funcionalidades específicas.

Ejemplos:

```text
feature/authentication
feature/keycloak
feature/runtime-config
feature/docker-release
```

---

## fix/*

Se crean según necesidad, a partir de la rama develop.
Se utiliza para corregir errores. 

Ejemplos:

```text
fix/login
fix/users
fix/docker-release
```