#Ta lige stilling - Debat site
Frontend development done for Kontrapunkt by Mads Viktor.

##Tech setup
Some boilerplate based on @Akikoo Frontend Workflow:
http://github.com/akikoo/grunt-frontend-workflow

CMS used: Keystone JS (www.keystonejs.com)

##Environment setup

You'll need the following tools to get the full advantages of this workflow:

###Ruby
On OS X, you'll already have Ruby installed. On Windows, see http://rubyinstaller.org/downloads/.

###Sass and Compass

Make sure you have Ruby installed before this step.

Install Sass: http://sass-lang.com/tutorial.html.

Install Compass: http://compass-style.org/install/.

###Node.js
Install Node.js with npm (package manager for Node): http://nodejs.org/.

###Grunt
See http://gruntjs.com/getting-started.

    npm uninstall -g grunt
    npm install -g grunt-cli

After installing grunt-cli (Grunt's command line interface) globally, go to the
project folder and install all the dependencies listed in package.json. This will
install a local version of Grunt as well.

    npm install

That's it.

##Development

To start developing, go to the project folder in your terminal and run

    grunt

Then go to http://localhost:9001/ to view your site. You can also access your
local site from another device on the same LAN by using your IP address instead
of `localhost`, for example http://10.0.0.32:9001/. Files are being observed
for changes using livereload so you don't need to refresh the page manually.
Stylesheets are generated from Sass files, and CSS and JavaScript files are linted.