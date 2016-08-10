Pokemon Go Reader
=================
Requests information about Pokemon currently in inventory from Niantic and displays stats for each Pokemon in a table.

IV Explanation
--------------
![IV Explanation Panel 1](http://i.imgur.com/eM1JBYM.png "IV Explanation Panel 1")

![IV Explanation Panel 2](http://i.imgur.com/K0bgtif.png "IV Explanation Panel 2")

![IV Explanation Panel 3](http://i.imgur.com/pd1hC2C.png "IV Explanation Panel 3")

![IV Explanation Panel 4](http://i.imgur.com/7Ca1qE9.png "IV Explanation Panel 4")

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

Acknowlegements
---------------
* This project wouldn't be possible without [cyraxx](https://github.com/cyraxx) and the other developers over at [PogoBuf](https://github.com/cyraxx/pogobuf). They're doing all the heavy lifting. A huge thanks to everyone who's working on that project!

* Using [justinleewells](https://github.com/justinleewells) [level-to-cp](https://github.com/justinleewells/pogo-optimizer/blob/master/data/game/level-to-cpm.json) map to calculate Pokemon level.

Warning
-------

Pulling data from Niantic by anything other than the Pokemon Go app violates the Pokemon Go Terms of Use:

>USER RIGHTS AND RESTRICTIONS. These Terms grant permission to you, in your individual capacity, to use the content of Service made available to you for personal, noncommercial home use only. In no instance may you:
>
> ... 
>
> (ii) Modify, or create derivative works based on, the content;
>
>(iii) Use, or facilitate the use of, any unauthorized third-party software (e.g. bots, mods, hacks, and scripts) to modify or automate operation within the Service whether for yourself or for a third party.
>
>...
>
>(vi) Decompose, disassemble, or reverse engineer any part of any Service, or otherwise use a Service for any purpose other than those provided for by us and in conjunction with the operations of the Service;

I haven't heard of any instances of account bans for reasons other than botting or mapping, but keep in mind there is a risk when using this tool or others like it. 

Known Issues 
------------
* IE doesn't like the CSS used in the table. Solution: don't use IE.

FAQs
-----
* **Help! I'm seeing errors after an `npm start` on my Linux system! I've followed all of the setup instructions and it just isn't working!**

  The postinstall script doesn't seem to run automatically on some Linux systems. Try running `npm run postinstall` after `npm install`. See [issue #1](https://github.com/Eric-Carlton/PokemonGoReader/issues/1) for a full description.

* **I can't seem to log in with my Google account, even though I know I'm using the correct email and password. What gives?**

  If you use a Google account and have two factor authentication enabled, you will need to [generate an app password](https://security.google.com/settings/security/apppasswords) and use that to log in.

* **I liked the original table layout instead of this fancified card layout. Can we bring that back?**
  
    Yes you can! If you want to see your Pokemon stats in a table, go to webapp/services/properties.service.ts and change the useTabularFormat property to true. Restart the webapp portion ( or the whole thing if you're running with `npm start` ) and bingo-bango, you have the table again! 

* **I don't want to transfer or rename Pokemon from this tool. In fact, I don't even want to *accidentally* transfer or rename from this tool. Can I get rid of those buttons?**

  There's a config option for that as well! Go to webapp/services/properties.service.ts and change the showTransferButton and/or the showRenameButton property to false. Restart the webapp portion ( or the whole thing if you're running with `npm start` ) and say goodbye to that rename and/or transfer button!

* **There's a lot of information in the table layout, some of which I don't even care about. Is it possible to remove some of the noise?**
  
  Sure! There's configuration available for this. Go to webapp/services/properties.service.ts and look for the pokemonTableStats property. Just remove anything from that array that you don't want to see in your table. Once [issue #28](https://github.com/Eric-Carlton/PokemonGoReader/issues/28) is implemented, you'll be able to change this and some other config options mentioned in this FAQ from the UI.

* **I want to allow other computers on my local network to access the tool from my computer. Is that possible?**
  
  It sure is! You do, however, need to make some configuration changes. 

  1. Open up webapp/services/properties.service.ts and find the apiHost property. In a normal configuration, that is set to `'//' + window.location.hostname + ':8008'`. You'll need to change this to `'//<local_ip_of_machine_running_the_node_server>:8008'`. 
  2. Next, you'll need to open up port 8080 and port 8008 on your computer's firewall so that requests can make it through to the webserver and the Node server. 
  3. Restart the webapp portion ( or the whole thing if you're running with `npm start` ) and you should be set!

* **Running locally is fine and dandy, but what about if I want my friends to be able to access the tool *outside* of my local network?**
  
  Well, dear traveller, you are in for a treat! This is definitely possible, but takes a bit of setup to get going. Be warned, this opens your computer up to external traffic, which may not always be friendly! Proceed with caution! Here is a list of steps to get you started. I haven't actually done this, so take it with a grain of salt, but this should theoretically work.

  1. You're going to need to forward ports 8080 and 8008 in your router's settings. If you don't know how to do this, you can likely Google '&lt;your_router_model&gt; port forwarding' and figure it out.
  2. Next, you'll need to open up your firewall on ports 8080 and 8008, if you haven't done this already. 
  3. Change the apiHost property in webapp/services/properties.service.ts to `'//<your_public_ip>:8008'`. Your public IP can be obtained from an IP checker [like this one](https://whatismyipaddress.com).
  4. You should now be able to access the tool from outside your local network by navigating to <your_public_ip>:8080. Your public IP is likely IPv6, which requires some [fancy address bar formatting](http://www.cyberciti.biz/faq/how-can-ipv6-address-used-with-webbrowser/) to get your browser to navigate to it. 

* **I'm trying to host this project on Amazon/Heroku/Azure, but I keep getting 403's on login**

  Niantic has banned [a lot of major VPS providers](https://www.reddit.com/r/pokemongodev/comments/4vhygk/_/?st=irmo101z&sh=8816b817), so you'll have to search around to find one that isn't banned yet.

* **I'm facing an issue that hasn't been addressed here, or I'd like to add a feature request**

  [Open up an issue](https://github.com/Eric-Carlton/PokemonGoReader/issues). I try to respond to errors within 24 hrs - no guarantees - and I'll generally prioritize feature requests weekly. If an issue is marked 'free to take', that means I don't plan on getting to it any time soon, but anyone is welcome to fork my repo and submit a pull request!

Screenshots
-----------
![Login Screen](http://i.imgur.com/tCTIO5a.png "Login Screen")

![Pokemon Stats Cards](http://i.imgur.com/MqTUnFt.png "Pokemon Stats Cards") 

![Pokemon Stats Table](http://i.imgur.com/NY7UQlQ.png "Pokemon Stats Table") 