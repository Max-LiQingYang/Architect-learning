let ip1 = '192.168.0.1';
let ip2 = '192.168.0.4';
let mask = '255.255.255.0';

function same(ip1, ip2, mask) {
    let ip1s = ip1.split('.').map(item => parseInt(item).toString(2).padStart(8, '0')).join('');
    let ip2s = ip2.split('.').map(item => parseInt(item).toString(2).padStart(8, '0')).join('');
    let masks = mask.split('.').map(item => parseInt(item).toString(2).padStart(8, '0')).join('');

    
}

let result = same(ip1, ip2, mask);
console.log(result);