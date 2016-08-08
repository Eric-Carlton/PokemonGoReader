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

FAQs
-----
* **Help! I'm seeing errors after an `npm start` on my Linux system! I've followed all of the setup instructions and it just isn't working!**

  The postinstall script doesn't seem to run automatically on some Linux systems. Try running `npm run postinstall` after `npm install`. See [issue #1](https://github.com/Eric-Carlton/PokemonGoReader/issues/1) for a full description.

* **I can't seem to log in with my Google account, even though I know I'm using the correct email and password. What gives?**

  If you use a Google account and have two factor authentication enabled, you will need to [generate an app password](https://security.google.com/settings/security/apppasswords) and use that to log in.

* **I want to allow other computers on my local network to access the tool from computer. Is that possible?**
  
  It sure is! You do, however, need to make some configuration changes. 

  1. Open up webapp/services/properties.service.ts and find the apiHost property. In a normal configuration, that is set to `'//' + window.location.hostname + ':8008'`. You'll need to change this to `'//<local_ip_of_machine_running_the_node_server>:8008'`. 
  2. Next, you'll need to open up port 8080 and port 8008 on your computer's firewall so that requests can make it through to the webserver and the Node server. 
  3. Restart the webapp portion ( or the whole thing if you're running with `npm start` ) and you should be set!

* **Running locally is fine and dandy, but what about if I want my friends to be able to access the tool *outside* of my local network?**
  
  Well, dear traveller, you are in for a treat! This is definitely possible, but takes a bit of setup to get going. Be warned, this opens your computer up to external traffic, which may not always be friendly! Proceed with caution! Here is a list of steps to get you started. I haven't actually done this, so take it with a grain of salt, but this should theoretically work.

  1. You're going to need to forward ports 8080 and 8008 in your router's settings. If you don't know how to do this, you can likely Google '<your_router_model> port forwarding' and figure it out.
  2. Next, you'll need to open up your firewall on ports 8080 and 8008, if you haven't done this already. 
  3. Change the apiHost property in webapp/services/properties.service.ts to `'//<your_public_ip>:8008`. Your public IP can be obtained from an IP checker [like this one](https://whatismyipaddress.com).
  4. You should now be able to access the tool from outside your local network by navigating to <your_public_ip>:8080. Your public IP is likely IPv6, which requires some [fancy address bar formatting](http://www.cyberciti.biz/faq/how-can-ipv6-address-used-with-webbrowser/) to get your browser to navigate to it. 

* **I'm facing an issue that hasn't been addressed here, or I'd like to add a feature request**

  [Open up an issue](https://github.com/Eric-Carlton/PokemonGoReader/issues). I try to respond to errors within 24 hrs - no guarantees - and I'll generall prioritize feature requests weekly. If an issue is marked 'free to take', that means I don't plan on getting to it any time soon, but anyone is welcome to fork my repo and submit a pull request!

Notes
-----
* If you prefer not to have a transfer button in the table at all, you can change the showTransferButton property in webapp/services/properties.service.ts.

Screenshots
-----------
![Login Screen](http://i.imgur.com/tCTIO5a.png "Login Screen")

![Pokemon Stats Table](http://i.imgur.com/eRLGmxJ.png "Pokemon Stats Table") 