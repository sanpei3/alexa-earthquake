MODULE=alexa-earthquake
FUNCTION_NAME=earthquake-alexa
all:
	node index.js
	zip -r -q ${MODULE} index.js  node_modules
	aws lambda update-function-code --function-name "${FUNCTION_NAME}" --zip-file fileb://${MODULE}.zip


install-module:
	npm install alexa-sdk
