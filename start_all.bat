@echo off
REM Open the first terminal and run the Node.js server
start cmd /k "cd server && npm run server"

REM Open the second terminal and run the Angular frontend
start cmd /k "cd client && ng serve"
@REM 
