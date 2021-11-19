
const chalk = require('chalk');
const readline = require('readline');
const { stdin: input, stdout: output, exit } = require('process');
const rl = readline.createInterface({ input, output });

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

var socket = require('socket.io-client')(HOST +':' + PORT);

socket.on('disconnect', function() {
    console.log(chalk.red("Socket disconnected! Please check the server connection and try again!"));
    exit(1);
});
  
socket.on('search', (data) => {
    //if error returned handle the error first
    if (data.error !== undefined) {
        console.log(chalk.red(data.error));
    } else {
        //process the data and output it
        console.log(chalk.green('(%d/%d) %s - [%s]'),data.page,data.resultCount,data.name,data.films);
    }
    if (data.page == data.resultCount) { //if page count and result count match allow new search
        search();
    }
});

socket.on('connect', () => {
    console.log('=== server connected ===');
    console.log('To Exit the application press CTRL + C at any time.')
    search(); //start search function once server connected
});

socket.on('connect_error', (error) => {
    console.log(chalk.red("Server connection errored with error type %s"), error.type);
    exit(0);
});

rl.on('close', (input) => {
    console.log('\nThank you for using the Movie Search App! Exiting now!');
    exit(0);
});

const search = async () => {
    // Get the search string from user
    rl.question(chalk.cyan('What character would you like to search for? '), (searchQuery) => {
        console.log(chalk.yellow('Searching for char: %s'), searchQuery);      
        var payload = {};
        payload.query = searchQuery;
        socket.emit('search', payload);
    });
};
