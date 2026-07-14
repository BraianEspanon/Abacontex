# Postman Collections

Todas las colecciones de Postman deben almacenarse en la carpeta **`/postman`**, ubicada en la raíz del proyecto.

Actualmente existen dos colecciones con distintos propósitos:

- **`Abacontex.postman_collection.json`**: colección oficial del proyecto, mantenida por el equipo de **Backend**. Debe contener todos los endpoints disponibles y mantenerse actualizada con cada cambio en la API.
- **`Abacontex_testing.postman_collection.json`**: colección destinada al equipo de **Testing**, donde pueden organizar sus casos de prueba, requests auxiliares o flujos específicos sin modificar la colección oficial.

## Importar una colección

1. Abrir **Postman**.
2. Hacer clic en el menú de **tres puntos (`...`)**.
3. Seleccionar **Import**.
4. Elegir el archivo `.json` correspondiente dentro de la carpeta **`/postman`**.

## Actualizar una colección

Después de realizar un `git pull`, si una colección fue modificada:

1. Abrir **Postman**.
2. Hacer clic en el menú de **tres puntos (`...`)**.
3. Seleccionar **Import**.
4. Elegir nuevamente el archivo `.json`.
5. Reemplazar o actualizar la colección cuando Postman lo solicite.

## Exportar una colección

Si realizaste cambios en una colección y querés compartirlos:

1. Seleccionar la colección.
2. Entrar a la sección **More**.
3. Seleccionar **Export collection**.
4. Guardar el archivo dentro de la carpeta **`/postman`**, reemplazando el archivo correspondiente.
5. Realizar el commit junto con el resto de los cambios del proyecto.

> **Importante:** Los desarrolladores deben actualizar únicamente **`Abacontex.postman_collection.json`**, mientras que el equipo de Testing debe actualizar únicamente **`Abacontex_testing.postman_collection.json`**.
