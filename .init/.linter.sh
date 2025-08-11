#!/bin/bash
cd /home/kavia/workspace/code-generation/musician-discovery-platform-155277-155286/musician_marketplace_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

