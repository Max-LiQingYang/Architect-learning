let argv = [];
let args = process.argv;
for (let i = 2; i < args.length; i++) {
    let val = args[i];

    if (val.startsWith('--')) {
        argv[val.slice(2)] = args[++i];
    }
}