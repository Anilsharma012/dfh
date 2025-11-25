#!/bin/bash

# Start backend in background
echo "Starting backend on port 3001..."
cd backend1 && NODE_ENV=development SKIP_SEED=1 node index.js 2>&1 | sed 's/^/[BACKEND] /' &
BACKEND_PID=$!
cd /home/runner/workspace

# Wait for backend to start and verify it's running
echo "Waiting for backend to initialize..."
sleep 10

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
   echo "[INFO] Backend process (PID: $BACKEND_PID) is running"
else
   echo "[WARNING] Backend process may have failed to start"
fi

# Start frontend  
cd Frontend1
echo "Starting frontend on port 5000..."
export PORT=5000
export DANGEROUSLY_DISABLE_HOST_CHECK=true
export WDS_SOCKET_PORT=0
export NODE_OPTIONS="--max-old-space-size=4096"
export BROWSER=none
exec npm start
