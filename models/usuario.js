const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const usuarioSchema = Schema({
    documento : {
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
    correo : {
        type : String,
        require : true ,
        trim : true
    },
    password : {
        type : String,
        require : true 
    },
    telefono : {
        type : Number,
    },
    rol :{
        type : String,
        default : 'ASPIRANTE',
        enum : {values : ['ASPIRANTE','COORDINADOR'], message : 'El rol no es valido' } 
    },
    hojaVida : {
        type : Buffer
    }
});

usuarioSchema.plugin(uniqueValidator);


const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;