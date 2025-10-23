#!/bin/bash

echo "Building React application..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful! Output in the 'build' directory."
else
  echo "Build failed!"
  exit 1
fi
