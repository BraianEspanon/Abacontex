#!/bin/sh

echo "Generating Prisma Client..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate deploy

echo "Running seeds..."
npx prisma db seed

echo "Starting application..."
npm run dev