const settingModel = require('../model/setting');
const collectionModel = require('../model/collection');
const customerModel = require('../model/customer');


function saveSetting(obj) {
    return new Promise((resolve, reject) => {
        obj.animal = obj.animal.toLowerCase();
        obj.animal = obj.animal[0].toUpperCase() + obj.animal.substr(1);
        const newSubject = new settingModel({
            animal: obj.animal,
            rate: obj.rate
        });
        newSubject.save((err, customer) => {
            if (err) {
                reject(err);
            } else {
                resolve(customer);
            }
        });
    });
}

function getSetting() {
    return new Promise((resolve, reject) => {
        settingModel.find({})
            .exec((err, settingData) => {
                if (err) {
                    return reject(err);
                }
                resolve({
                    data: settingData,
                    count: settingData.length
                });
            });
    });
}


function updateSetting(obj) {
    obj.animal = obj.animal.toLowerCase();
    obj.animal = obj.animal[0].toUpperCase() + obj.animal.substr(1);
    return settingModel.findOneAndUpdate({ _id: obj.id }, { $set: { animal: obj.animal, rate: obj.rate } });
}

function clearData() {
    return new Promise((resolve, reject) => {
        settingModel.collection.drop().then(() => {
            return collectionModel.collection.drop();
        }).then(() => {
            return customerModel.collection.drop();
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}


module.exports = {
    getSetting,
    saveSetting,
    updateSetting,
    clearData
};