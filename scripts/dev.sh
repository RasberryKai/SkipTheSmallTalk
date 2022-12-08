#!/usr/bin/env bash

rm .env
cp ./environments/dev/.env .env
react-scripts start
