#!/bin/bash
set -e

# ==============================================================================
# Abacontex - Script de Respaldo Automatizado de Base de Datos PostgreSQL
# ==============================================================================

BACKUP_DIR="${BACKUP_DIR:-/opt/backups/database}"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="${POSTGRES_CONTAINER:-abacontex-postgres-prod}"
DB_USER="${POSTGRES_USER:-postgres}"
DAYS_TO_KEEP="${BACKUP_DAYS_TO_KEEP:-7}"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] === Iniciando proceso de respaldo de Abacontex ==="

# Respaldo en caliente de ambas bases de datos: ERP (abacontex) e IAM (keycloak)
for DB_NAME in "abacontex" "keycloak"; do
    BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql.gz"
    echo "[$(date)] Generando volcado comprimido de la base '$DB_NAME'..."

    docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

    # Verificación de integridad: el archivo no debe estar vacío
    if [ -s "$BACKUP_FILE" ]; then
        FILE_SIZE=$(du -sh "$BACKUP_FILE" | awk '{print $1}')
        echo "[$(date)] [OK] Respaldo exitoso de '$DB_NAME': $BACKUP_FILE ($FILE_SIZE)"
    else
        echo "[$(date)] [ERROR] El archivo de respaldo de '$DB_NAME' está vacío."
        exit 1
    fi
done

# Política de rotación: eliminar respaldos con más de N días
echo "[$(date)] Aplicando política de retención (conservar últimos $DAYS_TO_KEEP días)..."
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$DAYS_TO_KEEP" -delete

echo "[$(date)] === Respaldo finalizado exitosamente ==="
