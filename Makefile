all:
	zip -r -q alexa-earthquake index.js node_modules

install-module:
	npm install request-promise
	npm install request
	npm install alexa-sdk
