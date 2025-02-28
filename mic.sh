#!/bin/bash

root="$(pwd)"

# Exporto variable MDB_PORT al entorno
export $(cat .env | xargs)

app_env=$APP_ENV
port_backend=$PORT_BACKEND
port_client=$PORT_CLIENT
port_client_backoffice=$PORT_CLIENT_BACKOFFICE

# Configuración de la base de datos
DB_NAME=$DATABASE_NAME
DB_USER=$DATABASE_USERNAME
DB_PASSWORD=$DATABASE_PASSWORD
DB_HOST=$DATABASE_HOST
DB_PORT=$DATABASE_PORT
# Ruta de destino para el respaldo
BACKUP_DIR=$root/backups
# Nombre del archivo de respaldo
BACKUP_FILE=$DB_NAME"_$(date +'(%d-%m-%Y)').sql"

# Evaluo el comando entrante
case "$1" in

     install)
        echo "Instalando dependencias del backend..."
        cd $root/backend
        npm i
        
        echo "Instalando dependencias del client..."
        cd $root/client
        npm i

        echo "Instalando dependencias del client backoffice..."
        cd $root/client-backoffice
        npm i
        ;;

    update)
        echo "Actualizando repositorio a ultima version, rama: $(git rev-parse --abbrev-ref HEAD)" 
        git pull origin $(git rev-parse --abbrev-ref HEAD)
        echo "Ejecutando migraciones..."
        cd $root/backend
        npm run migrate:up
        ;;

    # reset)
    #     cd $root/backend
    #     npm run migrate:undo
    #     npm run migrate:up
    #     if [ "$app_env" == "preprod" ]; then
    #         npm run seeders-preprod:up
    #     else
    #         npm run seeders:up
    #     fi
    #     ;;

    reseed)
        cd $root/backend
        npm run seeders:undo
        if [ "$app_env" == "preprod" ]; then
            npm run seeders-preprod:up
        else
            npm run seeders:up
        fi
        ;;
    
    start)
        echo "Levantando backend en puerto: $port_backend..."
        cd $root/backend
        npm run build
        #forever start dist/src/main.js
        pm2 start dist/src/main.js --name "backend-$app_env"  --namespace "$app_env"

        echo "Levantando Client en puerto: $port_client..."
        cd $root/client
        npm run build
        if [ "$app_env" == "preprod" ]; then
            #forever start -c "npm run start-preprod" ./
            pm2 start "npm run start-preprod" --name "client-$app_env" --namespace "$app_env"
        fi
        if [ "$app_env" == "prod" ]; then
            #forever start -c "npm run start" ./ 
            pm2 start "npm run start" --name "client-$app_env" --namespace "$app_env"
        fi
        if [ "$app_env" == "devprod" ]; then
            #forever start -c "npm run start" ./
            pm2 start "npm run start-devprod" --name "client-$app_env" --namespace "$app_env"
        fi
        echo "Client levantado en modo: $app_env."

        echo "Levantando Client Backoffice en puerto: $port_client_backoffice..."
        cd $root/client-backoffice
        npm run build
        if [ "$app_env" == "preprod" ]; then
            #forever start -c "npm run start-preprod" ./
            pm2 start "npm run start-preprod" --name "client-backoffice-$app_env" --namespace "$app_env"
        fi
        if [ "$app_env" == "prod" ]; then
            #forever start -c "npm run start" ./
            pm2 start "npm run start" --name "client-backoffice-$app_env" --namespace "$app_env"
        fi
        if [ "$app_env" == "devprod" ]; then
            #forever start -c "npm run start" ./
            pm2 start "npm run start-devprod" --name "client-backoffice-$app_env" --namespace "$app_env"
        fi
        echo "Client levantado en modo: $app_env."
        ;;

    status)
        # forever list
        pm2 list
        ;;
    
    stop)
        echo "Bajando backend..."
        pm2 delete "backend-$app_env"
        echo "Backend detenido."

        echo "Bajando client..."
        pm2 delete "client-$app_env"
        echo "Client detenido."

        echo "Bajando client backoffice..."
        pm2 delete "client-backoffice-$app_env"
        echo "Client backoffice detenido."

        # pid_backend=$(sudo lsof -t -i:$port_backend -sTCP:LISTEN)
        # if [ -n "$pid_backend" ]; then
        #     kill -9 "$pid_backend"
        #     echo "Backend detenido."
        # else
        #     echo "Backend no está en ejecución."
        # fi
        # pid_client=$(sudo lsof -t -i:$port_client -sTCP:LISTEN)
        # if [ -n "$pid_client" ]; then
        #     kill -9 "$pid_client"
        #     echo "Client detenido."
        # else
        #     echo "Client no está en ejecución."
        # fi
        # pid_client_backoffice=$(sudo lsof -t -i:$port_client_backoffice -sTCP:LISTEN)
        # if [ -n "$pid_client_backoffice" ]; then
        #     kill -9 "$pid_client_backoffice"
        #     echo "Client backoffice detenido."
        # else
        #     echo "Client backoffice no está en ejecución."
        # fi
        ;;

    restart)
        bash ./mic.sh stop
        bash ./mic.sh start
        ;;

    backup)
        # Asignar la contraseña a la variable de entorno PGPASSWORD
        export PGPASSWORD=$DB_PASSWORD

        # Realizar respaldo
        pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/$BACKUP_FILE" -w

        # Limpiar la variable de entorno PGPASSWORD después de usarla
        unset PGPASSWORD

        # Verificar si el respaldo fue exitoso
        if [ $? -eq 0 ]; then
            echo "Respaldo completado exitosamente. Archivo: $BACKUP_DIR/$BACKUP_FILE"
        else
            echo "Error al realizar el respaldo."
        fi
        ;;

    backup_ssh)
        # Configuración del túnel SSH
        SSH_TUNNEL_HOST="138.36.98.45"
        SSH_TUNNEL_PORT="9656"
        SSH_USERNAME="Camad-1"
        LOCAL_DB_PORT=8006
        
        # Crear el túnel SSH
        sshpass -p 'ayfYWh*2*fq8' ssh -L "$LOCAL_DB_PORT:localhost:$DB_PORT" "$SSH_USERNAME@$SSH_TUNNEL_HOST" -p "$SSH_TUNNEL_PORT" -N &

        # Esperar un breve momento para asegurar que el túnel se haya establecido
        sleep 2

        # Realizar el respaldo
        pg_dump -h "localhost" -p "$LOCAL_DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F c -b -v -f "$BACKUP_DIR/$BACKUP_FILE" -W

        # Verificar si el respaldo fue exitoso
        if [ $? -eq 0 ]; then
            echo "Respaldo completado exitosamente. Archivo: $BACKUP_DIR/$BACKUP_FILE"
        else
            echo "Error al realizar el respaldo."
        fi
        pkill -f "ssh -L $LOCAL_DB_PORT:localhost:$DB_PORT $SSH_USERNAME@$SSH_TUNNEL_HOST -p $SSH_TUNNEL_PORT -N"
        ;;

    restore)
        # Realizar restauración
        read -p "Ingrese el nombre del archivo de respaldo a restaurar: " RESTORE_FILE
        pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -v "$BACKUP_DIR/$RESTORE_FILE" -W

        # Verificar si la restauración fue exitosa
        if [ $? -eq 0 ]; then
            echo "Restauración completada exitosamente."
        else
            echo "Error al restaurar el respaldo."
        fi
        ;;
    
esac
