# Getting to run the frontend

## Install packages

   ```
   node -v v8.10.0
   ```
   ```
    npm -v 6.8.0
   ```
   
## Start the app

1. In order not to have any problem with HTTPS security, **brefore running the frontend** write the following url in the browser's search bar and proceed ignoring the warnings brefore running the frontend.
   ```
   https://localhost:8765/observatory/api/products
   ```
   
2. From within the **frontend** directory, run:

   ```
   npm install
   ```
   
   ```
   HTTPS=true npm start
   ```
   After the ```npm start``` command, a browser tab will open and you must select "proceed" in the warning about security.
