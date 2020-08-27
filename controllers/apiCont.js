const urunModel = require('../models/urunModel')
const userModel = require('../models/userModel')
const kategoriModel = require('../models/kategoriModel')
const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const slugify = require('slugify')
const sharp = require('sharp')
const defaultShowCount = 25

var ShowcasefileNames = [];
var PreviewfileNames = [];

//set Storage Engine for Showcase
const storage = multer.diskStorage({
    destination: 'public/assets/img',
    filename: (req, file, cb) => {

        var filename = slugify(req.headers["name"]) + "-" + Date.now() + "-Showcase" + path.extname(file.originalname)
        var filenamePreview = slugify(req.headers["name"]) + "-" + Date.now() + "-Preview" + path.extname(file.originalname)

        var fileOriginalName = file.originalname

        ShowcasefileNames.push({
            fileOriginalName,
            filePath: filename
        })

        PreviewfileNames.push({
            fileOriginalName,
            filePath: filenamePreview
        })


        cb(null, filename)
        //cb(null, filenamePreview)
    }
})


/*
const uploadShowcase = multer({ storage: storageShowcase }).array('files')
const uploadPreview = multer({ storage: storagePreview }).array('previewfiles')
*/


const upload = multer({ storage: storage }).array('files')

module.exports.productsPOST = async (req, res, next) => {



    const urunPhotoInfos = JSON.parse(req.headers["urunphotos"])
    const urunCategoryID = req.headers["category"]
    const urunName = req.headers["name"]


    await upload(req, res, (err) => {
        if (err) {
            throw err
        } else {

            console.log(PreviewfileNames.length)

            for (let Index = 0; Index < ShowcasefileNames.length; Index++) {
                const ShowfileInfo = ShowcasefileNames[Index];
                const prefileInfo = PreviewfileNames[Index];

                console.log("public/assets/img/" + prefileInfo.filePath)
                sharp("public/assets/img/" + ShowfileInfo.filePath).resize({ width: 580, height: 460, fit: "inside" }).toFile("public/assets/img/" + prefileInfo.filePath)
            }

            var urunInsert = []
            for (let i = 0; i < urunPhotoInfos.length; i++) {
                const element = urunPhotoInfos[i];

                console.log("ShowCase---------------------------------------------")
                console.log(ShowcasefileNames[i])
                console.log("Preview----------------------------------------------")
                console.log(PreviewfileNames[i])
                console.log("Preview-Full-----------------------------------------")
                console.log(PreviewfileNames)


                var insertItem =
                {
                    colorHEX: element.colorHEX,
                    coloredShowcasePath: ShowcasefileNames[i].filePath,
                    coloredPreviewPath: PreviewfileNames[i].filePath,
                    colorName: element.colorName
                }

                urunInsert.push(insertItem)

                if (i + 1 === urunPhotoInfos.length) {

                    var newProduct = new urunModel({
                        urunType: urunCategoryID,
                        urunName: urunName,
                        urunPhotos: urunInsert
                    })
                    newProduct.save((err) => {
                        if (err) { throw err }
                        res.send(true)
                        return
                    })
                }
            }



        }
    })








    /*
    await uploadPreview.array('previewfiles')(req,res,(err)=>{
        if (err) {
            console.log("PREVIEW")
            throw err
        }
    })

    var urunInsert = []
    for (let i = 0; i < urunPhotoInfos.length; i++) {
        const element = urunPhotoInfos[i];

        console.log("ShowCase---------------------------------------------")
        console.log(ShowcasefileNames[i])
        console.log("Preview----------------------------------------------")
        console.log(PreviewfileNames[i])
        console.log("Preview-Full-----------------------------------------")
        console.log(PreviewfileNames)
                        
                        
        var insertItem =
        {
            colorHEX: element.colorHEX,
            coloredShowcasePath: ShowcasefileNames[i].filePath,
            coloredPreviewPath:PreviewfileNames[i].filePath,
            colorName: element.colorName
        }
                        
        urunInsert.push(insertItem)

        if(i+1 === urunPhotoInfos.length){
                        
            var newProduct = new urunModel({
                urunType:urunCategoryID,
                urunName:urunName,
                urunPhotos:urunInsert
            })
            newProduct.save((err)=>{
                if (err) {throw err}
                res.send(true)
                return
            })
        }
    }
*/

    /*
    
        uploadShowcase(req, res, (err) => {
            if (err) {
                console.error("Showcase")
                throw err
            } else {
    
                uploadPreview(req, res, (err) => {
                    if (err) {
                        console.error("Preview")
                        throw err
                    } else {
    
                        var urunInsert = []
                        for (let i = 0; i < urunPhotoInfos.length; i++) {
                            const element = urunPhotoInfos[i];
    
                            console.log("ShowCase---------------------------------------------")
                            console.log(ShowcasefileNames[i])
                            console.log("Preview----------------------------------------------")
                            console.log(PreviewfileNames[i])
                            console.log("Preview-Full-----------------------------------------")
                            console.log(PreviewfileNames)
                            
                            
                            var insertItem =
                            {
                                colorHEX: element.colorHEX,
                                coloredShowcasePath: ShowcasefileNames[i].filePath,
                                coloredPreviewPath:PreviewfileNames[i].filePath,
                                colorName: element.colorName
                            }
                            
                            urunInsert.push(insertItem)
    
                            if(i+1 === urunPhotoInfos.length){
                            
                                var newProduct = new urunModel({
                                    urunType:urunCategoryID,
                                    urunName:urunName,
                                    urunPhotos:urunInsert
                                })
                                newProduct.save((err)=>{
                                    if (err) {throw err}
                                    res.send(true)
                                    return
                                })
                            }
                        }
                    }
                })
            }
        })
    
    */









}
module.exports.categoriesGET = (req, res, next) => {
    kategoriModel.find({}, (err, docs) => {
        if (err) { throw err }

        res.send(docs)
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
module.exports.productsDELETE = (req, res, next) => {
    console.log(req.body)
    urunModel.deleteOne({ _id: req.body.deletedProductId }, (err) => {
        if (err) {
            res.send(false)
        } else {
            res.send(true)
        }

    })
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

    userModel.deleteOne({ _id: req.body.deletedUserId }, (err) => {
        if (err) res.send(false)
        res.send(true)
    })
}

module.exports.verifyuserPUT = (req, res, next) => {

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