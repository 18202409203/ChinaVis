function json2csv(json) {
    var r = [];
    for (let k in json) {
        json[k].push(k)
        r.push(json[k])
    }
    r.sort((a, b) => b.length - a.length)
    var z = '';
    for (let i of r)(z += i.join('-') + ',' + i.slice(-1)[0] + '\n')
    console.log(z)
}