Pokemon Go Reader
=================
Requests information about Pokemon currently in inventory from Niantic and displays stats for each Pokemon in a table.

Dependencies
------------
1. Install [NodeJS](https://nodejs.org/) - Node version used in development is 6.3.1
2. Navigate to project root, open a terminal, and run:

  `npm install` 

  to install dependencies

   
Building/Running
----------------
* To run both the Node server and the webapp, open a terminal in the project root and run:
  
  `npm start`

  This will start the Node server on the port specified in server/config/properties.js by the server.port property. It will also transpile the webapp and start a http-server instance on [http://localhost:8080](http://localhost:8080).

* To run only the Node server, open a terminal in the project root and run:

  `npm run server`

  This will start the Node server on the port specified in server/config/properties.js by the server.port property.

* To run only the webapp, open a terminal in the project root and run: 

  `npm run webapp`

  This will transpile the webapp and start a http-server instance on [http://localhost:8080](http://localhost:8080).

* To run only the webapp in development mode, open a terminal in the project root and run:

  `npm run webapp-dev`

  This will transpile the webapp, watch for front end changes and re-transpile when they are detected, and start a lite-server instance on [http://localhost:3000](http://localhost:3000).

Notes
-----
* If you use a Google account and have two factor authentication enabled, you will need to [generate an app password](https://security.google.com/settings/security/apppasswords) and use that to log in.

Screenshots
-----------
![Login Screen](http://i.imgur.com/tCTIO5a.png "Login Screen")

![Pokemon Stats Table](http://i.imgur.com/VGuqIxv.png "Pokemon Stats Table") 