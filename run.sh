#!/bin/sh

# Start Next.js and pipe all output to stdout
npm start 2>&1 | tee /dev/stdout &
NEXT_PID=$!

# Wait for server to respond
until curl -s http://localhost:3000 > /dev/null; do
  sleep 1
done

echo "✅ Server is up! Running warmup..."
npm run warmup

wait $NEXT_PID
