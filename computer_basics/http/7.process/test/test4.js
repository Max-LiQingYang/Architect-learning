console.log('子进程', process.argv)
for (let i = 0; i < process.argv.length; i++) {
    process.stdout.write('i:' + i);
}

process.on('SIGTERM', function() {

});