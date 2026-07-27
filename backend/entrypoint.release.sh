#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Running system seeds..."
npx prisma db seed

echo "Starting application..."
npm start