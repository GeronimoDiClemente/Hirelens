#!/bin/bash

echo "Starting Note App Setup..."

# Backend Setup
echo "Installing Backend Dependencies..."
cd backend
npm install
# DB Schema is auto-created by TypeORM synchronize: true
echo "Starting Backend..."
npm run start &
BACKEND_PID=$!

# Frontend Setup
echo "Installing Frontend Dependencies..."
cd ../frontend
npm install
echo "Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo "App is running."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press CTRL+C to stop."

wait
