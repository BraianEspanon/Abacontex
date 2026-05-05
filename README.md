# **Nexora-G05**
Plataforma ERP educativa con IA que permite simular la gestión empresarial y mejorar el aprendizaje de contabilidad mediante validación inteligente y feedback en tiempo real.

## **Criterio de Línea Base**
Se definirá una línea base al finalizar cada entrega significativa del proyecto (por ejemplo: entregas parciales, versiones funcionales o hitos definidos en Scrum).

Cada línea base representará una versión estable del sistema.

# **Estructura del repositorio**
- 📂 **Documentacion/**
  - 📂 User Stories/
  - 📂 Casos de prueba/
  - 📂 Minutas/
  - 📂 Requerimientos/
- 📂 **Base de Datos/**
- 📂 **Desarrollo/**
  - 📂 Frontend/
  - 📂 Backend/
- 📂 **Equipo/**
- 📂 **Planificacion/**
- 📋 **README.md**

## **Listado de Ítems de Configuración**

| Nombre Ítem               | Regla de Nombrado                             | Ubicación                         |
|---------------------------|-----------------------------------------------|-----------------------------------|
| User Stories              | `US_<<NroUS>>_<<NombreUS>>.pdf`               | /Documentacion/User_Stories       |
| Casos de prueba           | `CP_<<NroCP>>_US<<NroUS>>_<<NombreCP>>.pdf`   | /Documentacion/Casos_de_prueba    |
| Minutas                   | `Minuta_<<Fecha>>.pdf`                        | /Documentacion/Minutas            |
| Requerimientos            | `REQ_<<NombreREQ>>_<<Version>>.pdf`           | /Documentacion/Requerimientos     |
| Readme                    | `README.md`                                   | /                                 |
| Base de Datos (Revisar)   | `BD_<<Version>>.sql`                          | /Base_de_datos                    |
| Frontend                  | Según convención del framework                | /Desarrollo/Frontend              |
| Backend                   | Según convención del lenguaje o framework     | /Desarrollo/Backend               |
| Equipo                    | `Equipo_<<Miembro>>.pdf`                      | /Equipo                           |
| Planificación             | `Planificacion_<<Periodo>>.xlsx`              | /Planificacion                    |

## **Reglas de Nombrado**

| Sigla | Significado |
|------|------------|
| `<<NroUS>>` | Número de User Story (01, 02, 03...) |
| `<<NroCP>>` | Número de Caso de Prueba (01, 02, 03...) |
| `<<NombreUS>>` | Nombre descriptivo de la User Story en PascalCase |
| `<<NombreCP>>` | Nombre del caso de prueba en PascalCase |
| `<<NombreREQ>>` | Nombre del requerimiento en PascalCase |
| `<<Version>>` | Número de versión (v1, v2, v1.1, etc.) |
| `<<Fecha>>` | Fecha de ocurrencia del evento. Con el formato 'dd-mm-aaaa' d:Día, m:Mes, a:Año |
| `<<Periodo>>` | Periodo de vigencia para la planificación. Se reconocerán los periodos con fecha de inicio y fecha fin, con el formato 'dd-mm-aaaa_dd-mm-aaaa' d:Día, m:Mes, a:Año |
| `<<Miembro>>` | Nombre del miembro que conforma el equipo en formato PascalCase (Ej: JuanPerez) |


# **Política de ramas**
## **Ramas**
- `main` → versión estable
- `develop` → integración de funcionalidades
- `feature/*` → nuevas funcionalidades
- `fix/*` → correcciones


## **Flujo de Trabajo**
1. Crear rama desde `develop`
2. Desarrollar funcionalidad
3. Crear Pull Request
4. Revisión por el equipo
5. Merge a `develop`
6. Versionado en línea base cuando corresponda

# Equipo
Proyecto desarrollado por estudiantes de Ingeniería en Sistemas – UTN FRC.

**Integrantes**
- Aráoz, Noel 
- Bacci Fernández, Nazarena 
- Españon Acevedo, Braian Abel 
- Insfran, Agustina Ayelén
- Torazza Pacheco, María Marta 
