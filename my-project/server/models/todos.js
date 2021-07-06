const { Schema, model } = require('mongoose')

const todosShema = new Schema({
    task:{
        type: String,
        required: true
    },
    complited:{
        type: Boolean,
        default: false
    },

})
module.exports = model('Todo', todosShema) //модель под названием Todo