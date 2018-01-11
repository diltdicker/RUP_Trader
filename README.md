# RUP Trader
##### Created by Dillon Dickerson

This project runs on __NodeJS__

### Install RUP Trader
* Install NodeJS
    * [NodeJS Binaries + Source](https://nodejs.org/en/download/)
### Other Dependencies
###### shell file
* run the _install-depends.*_ file to install all npm packages that are required
###### install individually
* ws - https://www.npmjs.com/package/ws
* express - https://www.npmjs.com/package/express
* mkdirp - https://github.com/substack/node-mkdirp
* forever-monitor - https://github.com/foreverjs/forever-monitor
* forever - https://www.npmjs.com/package/forever

### GDAX API key
To use this project you will need an api Key and an api Secret from Gdax (you will need to create an account).
[Generate API key](https://www.gdax.com/settings/api).

Once you have generated an api key and secret place them in the _RUP_Trader_ directory in a file called _api_key.json_.
The file format will need to be in this JSON format:
`{
    "api_key": "key value goes here",
    "api_secret": "secret value goes here"
}`
