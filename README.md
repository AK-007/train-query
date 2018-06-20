# train-query
A node app for providing live-status of trains along with other information after fetching details from the Indian Railways API.
This is solution for the Git-Heat [Week-1](https://github.com/ietbitmesra/Git-Heat/tree/master/Week-1) challenge. This node app accepts a 5-digit train number as a command line argument.

## Features :
1. Provided live status of the train
2. Provided other info like - name,schedule,running days of train
3. Stores the result in a .json file for future reference

## Running Locally :
Cloning and installing dependencies
```
  git clone https://github.com/AK-007/train-query
  cd train-query
  npm install
```
## Commands :
Now for getting the command's details for this app 
```
  node app.js --help
```
Or you can refer to this example for train query
```
  node app.js -t=12854
```
## Modules & Libraries used :
1. yargs - Used this as a command-line tool for parsing arguments
2. axios - Used this HTTP client which has built-in promises

The *fileHandler.js* is used for reading and writing .json files.

*P.S. There are still some trains that exists but the API says otherwise.*
