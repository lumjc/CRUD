const mongoose = require ('mongoose')
const path = require('path')
const coverImgBasePath = 'uploads/booksCovers'

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImgName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Author'
    }
})

bookSchema.virtual('coverImgPath').get(function(){
    if(this.coverImgName != null) {
        return path.join('/',coverImgBasePath, this.coverImgName)
    }
})

module.exports = mongoose.model('Book' , bookSchema)
module.exports.coverImgBasePath = coverImgBasePath