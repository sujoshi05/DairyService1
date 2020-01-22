const customerModel = require('../model/customer');

function saveCustomer(obj) {
    return new Promise((resolve, reject) => {
        const newSubject = new customerModel({
            name: obj.name,
            address: obj.address,
            adhaarNo: obj.aadhaar_no,
            mobile: obj.mobile
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

function getCustomers() {
    return customerModel.find({}, 'name').exec();
}


function getCustomer(id) {
    return new Promise((resolve, reject) => {
        customerModel.findById(id, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                if (doc && doc.name) {
                    resolve(doc);
                } else {
                    reject(doc);
                }
            }
        });
    });
}


function getCustomerByName(name) {
    return customerModel.find({ 'name': { $regex: new RegExp(name, 'i') } }).exec();
}

module.exports = {
    saveCustomer,
    getCustomers,
    getCustomer,
    getCustomerByName
};