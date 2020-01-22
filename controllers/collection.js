const MilkCollection = require('../model/collection');

function SaveCollection(obj) {
    return new Promise((resolve, reject) => {
        const newSubject = new MilkCollection({
            nameId: obj.customerName,
            date: new Date(obj.date),
            quantity: obj.quantity,
            quality: obj.quality,
            animal: obj.animal,
            rate: obj.rate,
            comments: obj.comments || ''
        });
        newSubject.save((err, collection) => {
            if (err) {
                reject(err);
            } else {
                resolve(collection);
            }
        });
    });
}

function getCollection(obj) {
    return new Promise((resolve, reject) => {
        obj.year = +obj.year;
        obj.month = +obj.month;
        let filter = { $gte: new Date(obj.year, obj.month, 1), $lte: new Date(obj.year, obj.month + 1, 0) };
        MilkCollection.aggregate([
            {
                $match: { date: filter }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'nameId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            { $unwind: '$profile' },
            {
                $group: {
                    _id: { name: '$profile.name', adhaarNo: '$profile.adhaarNo', customerId: '$profile._id' },
                    amount: { $sum: { $multiply: ['$quantity', '$rate'] } }
                }
            }
        ]).limit(+obj.perPage)
            .skip(obj.perPage * obj.page)
            .sort({ date: -1 })
            .exec((err, milkCollections) => {
                if (err) {
                    return reject(err);
                }
                MilkCollection.distinct('nameId', { date: filter })
                    .exec((err, distinctNames) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve({
                            data: milkCollections,
                            count: distinctNames.length
                        });
                    });
            });
    });
}

function getCollectionForCustomer(params) {
    params.year = +params.year;
    params.month = +params.month;
    let filter = { $gte: new Date(params.year, params.month, 1), $lte: new Date(params.year, params.month + 1, 0) };
    return new Promise((resolve, reject) => {
        MilkCollection.find({
            nameId: params.cust_id,
            date: filter
        }).limit(+params.perPage)
            .skip(params.perPage * params.page)
            .sort({ date: -1 })
            .exec((err, milkCollections) => {
                if (err) {
                    return reject(err);
                }
                MilkCollection.find({
                    nameId: params.cust_id,
                    date: filter
                }).exec((err, distinctNames) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        data: milkCollections,
                        count: distinctNames.length
                    });
                });
            });
    });
}

function getDataForGraph(params) {
    params.year = +params.year;
    let filter = [{
        $match: { date: { $gte: new Date(params.year, 0, 1), $lte: new Date(params.year, 11, 31) } }
    }];
    if (params.graph === '1') {
        filter.push({
            $group: {
                _id: { animal: '$animal', month: { $substr: ['$date', 5, 2] } },
                milk: { $sum: '$quantity' }
            }
        },
        {
            $group: {

                _id: '$_id.month',
                milk: {
                    $push: {
                        animal: '$_id.animal',
                        quantity: '$milk'
                    }
                }
            }
        });
    } else {
        filter.push({
            $group: {
                _id: { $substr: ['$date', 5, 2] },
                amount: { $sum: { $multiply: ['$quantity', '$rate'] } }
            }
        });
    }
    return new Promise((resolve, reject) => {
        MilkCollection.aggregate(filter)
            .exec((err, milkCollections) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(milkCollections);
                }
            });
    });
}

module.exports = {
    SaveCollection,
    getCollection,
    getCollectionForCustomer,
    getDataForGraph
};