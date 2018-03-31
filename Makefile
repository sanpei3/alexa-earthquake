all:
	zip -r -q alexa-earthquake index.js node_modules

install-module:
	npm install alexa-sdk
