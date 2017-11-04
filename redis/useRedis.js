const redis = require('redis');
const client = redis.createClient();
client.on('error', function (err) {
    console.log('error:', err);
})
client.on('ready', function () {
    console.log('redis is ready...');
})
exports.set = function (key, value) {
    client.set(key, value)
}
//获取方式: let result = await redisGet('aKey');
exports.get = function (key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        })
    })
}