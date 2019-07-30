const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const inscripcionSchema = Schema({
    idCurso : {
        type : String,
        require : true 
    },
    documento : {
        type : Number,
        require : true 
    }
});

inscripcionSchema.plugin(uniqueValidator);

inscripcionSchema.index({ idCurso: 1, documento: 1}, { unique: true });

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

module.exports = Inscripcion;