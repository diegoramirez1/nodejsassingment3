const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const cursoSchema = Schema({
    id : {
        type : Number,
        require : true ,
        trim : true ,
        unique : true 
    },
    nombre : {
        type : String,
        require : true ,
        trim : true
    },
    descripcion : {
        type : String,
        require : true ,
        trim : true
    },
    inversion : {
        type : Number,
        require : true 
    },
    modalidad : {
        type : String,
        trim : true,
        default : 'PRESENCIAL',
        enum : {values : ['PRESENCIAL','VIRTUAL'], message : 'El modalidad ingresada no es valida' } 
    },
    cargaHoraria :{
        type : Number
    },
    estado :{
        type : String,
        default : 'DISPONIBLE',
        enum : {values : ['CERRADO','DISPONIBLE'], message : 'El estado ingresado no es valido' } 
    }
});

cursoSchema.plugin(uniqueValidator);


const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;