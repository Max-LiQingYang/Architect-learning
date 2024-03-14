process.on('message', function(msg) {
    process.send('test3: ', msg);
});