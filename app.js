var yargs = require('yargs');
var axios = require('axios');
const cTable = require('console.table');
var fs = require('./fileHandler');

const argv = yargs
    .options('train',{
        alias : 't',
        demand : true,
        describe : 'Train number whose information required',
        type : 'number'
    })
    .help()
    .alias('help','h')
    .argv;

var trainNumber = argv.train;
var myapikey = "tlh95vcq46" ;
var railwayApiURL = `https://api.railwayapi.com/v2/name-number/train/${trainNumber}/apikey/${myapikey}/`; // Checks the train number
var addToFile = {}; // This object will contain train info for reference
var trainName,runningDays,source,destination;
var schedule = [];

function print(){
    // Function to output data in command line
    console.log('');
    console.log("Train Name : ",trainName);
    process.stdout.write('Runs on : ');
    for(i in runningDays){
        process.stdout.write(runningDays[i].code + ' ');
    }
    console.log('');
    console.log('');
    console.table(schedule);
};

axios.get(railwayApiURL).then((response) => {
    if(response.data.response_code === 404){
        throw new Error('No train present corresponding to this number.');
    }
    var file = trainNumber + '.json';
    if(fs.checkFile(file)){
        // If the train's info is present locally , no need to fetch the api
        // fs.checkFile() checks whether the file is present
        var fileContent = fs.readFile(file); // Reading the file
        trainName = fileContent.trainName;
        runningDays = fileContent.runningDays;
        schedule = fileContent.schedule;
        print();
        throw new Error('Fetched from file present locally.'); // Threw error to skip the further HTTP requests
    }
    else{
        // The file is not present locally so we should fetch the API for the same
        trainName = response.data.train.name;
        runningDays = response.data.train.days;
        runningDays = runningDays.filter((data) => data.runs=='Y'); // Filtering the array to include only the days on which the train runs
        addToFile.trainName = trainName;
        addToFile.runningDays = runningDays;
        var railwayApiURL2 = `https://api.railwayapi.com/v2/route/train/${trainNumber}/apikey/${myapikey}/`; // Gets the train route info
        return axios.get(railwayApiURL2);
    }
}).then((response) => {
    var trainRoute = response.data.route;
    for(i in trainRoute){
        schedule.push({
            Station : trainRoute[i].station.name,
            Arrival : trainRoute[i].scharr,
            Departure : trainRoute[i].schdep});
        if(trainRoute[i].scharr === 'SOURCE')source = trainRoute[i].station.name;
        if(trainRoute[i].schdep === 'DEST')destination = trainRoute[i].station.name;
    }
    print();
    addToFile.source = source;
    addToFile.destination = destination;
    addToFile.schedule = schedule;
    fs.writeFile(trainNumber+'.json',addToFile); // Writing to the file
    var today = new Date(); // Getting current date for live status of train
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){
    dd='0'+dd;
    }
    if(mm<10){
    mm='0'+mm;
    }
    today = dd+'-'+mm+'-'+yyyy;
    var railwayApiURL3 = `https://api.railwayapi.com/v2/live/train/${trainNumber}/date/${today}/apikey/${myapikey}/`; // Gets the live status of train
    return axios.get(railwayApiURL3);
}).then((response) => {
    if(response.data.response_code === 210){
        console.log('Live Status : The train does not run today.');
    }
    else{
        console.log('Live Status : ',response.data.position);
    }
}).catch((error) => {
    if(error.code === 'ENOTFOUND'){
        console.log('Unable to connect to API Servers');
    }
    else{
        console.log(error.message);
    }
});
