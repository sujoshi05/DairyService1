const crypto = require('crypto');
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3cPxj6pkXfviSJTUkDuV
TtYy81zMaJyP3l13ZoAp4CDWPv2y8w6SyqSAySiKDRSFJVzs0EJo+nGXei4rMnmp
Jwee1f8ya88y64JgGVpu3XSOP2o9gNM/xdmU3M2hqaLlE8twFRzzm/amYtA22KYm
TS/DpVguIJNYgFRttS4al9lk8G/Db0LLaRobefzHB3vzwq3WidfveKt3OEYsgEdd
iizFgB267bvmy6mrM4Hrofr/ST6BpeuzMuxAs3vTsIbeOVUoRbyoY9geM5lhfXaT
t416tDBgBk6Iqhg79wIxRIqPpKtXq1DstUYonphWjI6ruUdX6ZVO2vAz7hcj8E9+
mQIDAQAB
-----END PUBLIC KEY-----`;

module.exports = function (encryptedString) {
    return new Promise((resolve, reject) => {
        try {
            const buf = Buffer.from(encryptedString, 'base64');
            const dec = crypto.publicDecrypt(publicKey, buf);
            const planFormat = dec.toString('utf8');
            const expiryDate = new Date(planFormat).getTime();
            var nowTime = new Date().getTime();
            if (nowTime <= expiryDate) {
                resolve();
            } else {
                reject('Your subcription has been expired.');
            }
        } catch (e) {
            reject(e);
        }
    });


};