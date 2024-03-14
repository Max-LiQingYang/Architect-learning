const { spawn } = require('child_process');
function fork(modulepath, args, options) {
    let { silent } = options;
    let opts = Object.assign({}, options);
    if (silent) {
        opts.stdio = ['ignore', 'ignore', 'ignore'];
    } else {
        opts.stdio = [process.stdin, process.stdout, process.stderr]
    }

    spawn('node', [modulepath, ...args], opts);
};

let child = fork('fork.js', ['zfpx'], {
    cwd: __dirname,
    silent: false
});
