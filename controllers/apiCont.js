const urunModel = require('../models/urunModel')
const userModel = require('../models/userModel')
const kategoriModel = require('../models/kategoriModel')
const bcrypt = require('bcrypt')
const defaultShowCount = 25


module.exports.productsAddGET = (req, res, next) => {
    var newProduct = new urunModel({

    })
}


module.exports.productsGET = (req, res, next) => {

    if (req.query.options) {


        urunModel.find(req.query.options, async (err, docs) => {



            if (err) { throw err }

            var data
            var modifiedDocument = []
            await asyncForEach(docs, async (document, index) => {
                var kategoriIDGiven = document.urunType

                await kategoriModel.findOne({ kategoriID: kategoriIDGiven }, async (er, kategories) => {
                    if (er) { throw er }

                    kategories.kategoriName

                    document.urunType = kategories.kategoriName

                    modifiedDocument[index] = document

                })
            })

            urunModel.countDocuments({}, (err, count) => {
                if (err) { throw err }
                data = {
                    AlldocCount: count,
                    docs: modifiedDocument
                }

                res.send(data)
            })

        }).limit(parseInt(req.query.queryLimit)).lean()
        //buradaki lean metodu cok onemli saatler kaybettirebilir
        //referansi engelliyor


    }
    else {

        urunModel.find({}, async (err, docs) => {


            if (err) { throw err }

            var data
            var modifiedDocument = []
            await asyncForEach(docs, async (document, index) => {
                var kategoriIDGiven = document.urunType

                await kategoriModel.findOne({ kategoriID: kategoriIDGiven }, async (er, kategories) => {
                    if (er) { throw er }



                    kategories.kategoriName

                    document.urunType = kategories.kategoriName


                    modifiedDocument[index] = document




                })
            })

            urunModel.countDocuments({}, (err, count) => {
                if (err) { throw err }
                data = {
                    AlldocCount: count,
                    docs: modifiedDocument
                }

                res.send(data)
            })

        }).limit(parseInt(req.query.queryLimit)).lean()
        //buradaki lean referans almasini onluyor


    }
}




module.exports.requsersGET = (req, res, next) => {

    var data

    if (req.query.options) {

        userModel.find(req.options.concat({ isVerified: false }), (err, docs) => {

            if (err) { throw err }
            var data

            userModel.countDocuments(req.options.concat({ isVerified: false }), (err, count) => {
                data = {
                    AlldocCount: count,
                    docs: result
                }

                res.send(data)
            })

        }).limit(parseInt(req.query.queryLimit))


    } else {
        userModel.find({ isVerified: false }, (err, docs) => {

            if (err) { throw err }
            var data

            userModel.countDocuments({ isVerified: false }, (err, count) => {
                data = {
                    AlldocCount: count,
                    docs: docs
                }

                res.send(data)
            })

        }).limit(parseInt(req.query.queryLimit))
    }


}

module.exports.deluserDELETE = (req, res, next) => {
    userModel.deleteOne({_id:req.body.deletedUserId}, (err) => {
        if (err) res.send(false)
        res.send(true)
    })
}

module.exports.verifyuserPUT = (req, res, next) => {
    console.log(req.body)
    userModel.updateOne({ _id: req.body.verifiedUserId }, { isVerified: true }, (err, raw) => {
        res.send(raw)
    })
}


module.exports.editusersPUT = async (req, res, next) => {

    var gonnaUpdate = Object.assign({}, req.body)
    delete gonnaUpdate.editedUserId

    if (gonnaUpdate.password !== undefined) {
        gonnaUpdate.password = await bcrypt.hash(req.body.password, 10)
    }


    userModel.updateOne({ _id: req.body.editedUserId }, gonnaUpdate, (err, raw) => {
        res.send(raw)
    })

}


const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}