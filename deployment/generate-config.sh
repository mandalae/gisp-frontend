#!/usr/bin/env bash

ENVIRONMENT=$1

if [[ $ENVIRONMENT = "dev" ]]; then
    sed "s#<userPool>#${DEV_USER_POOL}#g" ./src/config/app-config-template.json > ./src/config/app-config.json
    sed -i "s#<clientId>#${DEV_CLIENT_ID}#g" ./src/config/app-config.json
    sed -i "s#<callbackUri>#${DEV_CALLBACK_URI}#g" ./src/config/app-config.json
    sed -i "s#<signoutUri>#${DEV_SIGNOUT_URI}#g" ./src/config/app-config.json
elif [[ $ENVIRONMENT = "prod" ]]; then
    sed "s#<userPool>#${PROD_USER_POOL}#g" ./src/config/app-config-template.json > ./src/config/app-config.json
    sed -i "s#<clientId>#${PROD_CLIENT_ID}#g" ./src/config/app-config.json
    sed -i "s#<callbackUri>#${PROD_CALLBACK_URI}#g" ./src/config/app-config.json
    sed -i "s#<signoutUri>#${PROD_SIGNOUT_URI}#g" ./src/config/app-config.json
else
    echo "No valid environment specified"
    exit 1
fi
