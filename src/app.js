const config = require('./config/config')
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var session = require('express-session')
var MemoryStore = require('memorystore')(session)
const sgMail = require('@sendgrid/mail');
const multer  = require('multer')
var stream = require('stream');
const fs = require ('fs');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// para gestion de memoria en el servidor
app.use(session({
    cookie: { maxAge: 1800000 },
    store: new MemoryStore({
      checkPeriod: 1800000 // prune expired entries every 30 min
    }),
    secret: 'keyboard cat'
}))

//to send mails
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const mailMsg = {
                    from: 'info@gestioncursosnodejs.com',
                    subject: 'Bienvenidos nuestro site',
                    html: '<strong>Esto es una prueba del curso de Node.js</strong>' +
                    '<br/>' +
                    '<br/>' +
                    'Bienvenido a la plataforma de cursos en linea, ahora usted podra inscribirse en los cursos ' +
                    'y hacer seguimiento a sus evaluaciones, desde la comodida de su hogar.'
                };

//seting handelbars config
app.set('view engine', 'hbs');

//configurando boostrap
const dirNode_modules = path.join(__dirname , '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//importando helpers
const directoriohelpers = path.join(__dirname,'../helpers');
require(directoriohelpers+'/helperAlumnos');
require(directoriohelpers+'/helperAdmin');
require(directoriohelpers+'/helperCoordinador');

//agregando partiales
const directoriopartials = path.join(__dirname,'../partials');
hbs.registerPartials(directoriopartials);

//agregando vistas
const directorioViews = path.join(__dirname,'../views');
app.set('views',directorioViews);

//agragndo directorio public
const directorioPublic = path.join(__dirname,'../public');
app.use(express.static(directorioPublic))

//seteando body-parser
app.use(bodyParser.urlencoded({extended:false}))

//importando el esquma de la DB - documento Usuario
const Usuario = require('../models/usuario')

//importando el esquma de la DB - documento Curso
const Curso = require('../models/curso')

//importando el esquma de la DB - documento Inscripcion
const Inscripcion = require('../models/inscripcion')

//conectando con BD
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, result) => {
    if (err) {
        return console.log(err)
    }
    console.log('conectado')
});

//configurando la session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

//agregando una funcion middleware (funcion que se llama para todos los request para mantener la sesion)
app.use((req, res, next) => {
    if (req.session.usuario){
        res.locals.session = true;
        res.locals.nombre = req.session.nombre;
        res.locals.rol = req.session.rol;
    }
    next()
})

//register a handlebar helper
hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

//middleware para subir archivos a carpetas o a BD
var upload = multer({  })  

// ----------------------- request management ----------------------------

//pagina de inicio sin colocar index en la url
app.get('/',(req,res) => {
    res.redirect('index');
});

//pagina de inicio url index
app.get('/index',(req,res) => {

    Curso.find({ estado : 'DISPONIBLE' }).exec(
        (err, lista) => {

           if (err) {
               res.render('index',{
                   mensaje : err
               })
           }

           res.render('index', {
               lista : lista
           });
   });
});

//pagina de registro de usuarios get
app.get('/registrar',(req,res) => {
    res.render('registrar')
});

//pagina de registro de usuarios post
app.post('/registrar', upload.single('hvarchivo') ,(req,res) => {

    let usuario = new Usuario({
            documento : req.body.numeroDocumento,
            nombre : req.body.nombre,
            correo : req.body.correo,
            password : bcrypt.hashSync(req.body.password,10),
            telefono : req.body.telefono,
            hojaVida : req.file.buffer
        }
    );

    usuario.save( (err,result) => {
        if (err){
            res.render('registrar',{
                mensaje : err
            })
        }

        mailMsg.to = req.body.correo;
        sgMail.send(mailMsg);

        res.render('registrar', {
            mensaje : 'El usuario ' + req.body.nombre + ' fue agregado exitosamente'
        })
    })

});

//manage post request for /ingresar
app.post('/ingresar',(req,res) => {

    Usuario.findOne({documento : req.body.documento}).exec(   
        (err,response) => {

            if (err) {
                res.render('ingresar',{
                    mensaje : err
                })
            }

            if (response && bcrypt.compareSync(req.body.password, response.password)) {

                req.session.usuario = response._id;
                req.session.nombre = response.nombre;
                req.session.rol = response.rol;
                req.session.documento = response.documento;
                req.session.telefono = response.telefono;
                req.session.correo = response.correo;
    
                res.render('ingresar', {
                    mensaje : 'Bienvenido ' + req.session.nombre,
                    session : true,
                    nombre  : req.session.nombre,
                    rol : req.session.rol,
                    correo  : req.session.correo,
                    telefono : req.session.telefono,
                    documento : req.session.documento
                })
            } else {
                res.render('ingresar', {
                    mensaje : 'Hay un error con el usuario o la contraseña' ,
                }) 
            }  
    });

});

//pagina de gestion de usuarios para el administrador (aqui es donde se cambia el rol de aspirante a coordinador)
app.get('/gestion',(req,res) => {
    Usuario.find({}).exec(
         (err, lista) => {

            if (err) {
                res.render('gestion',{
                    mensaje : err
                })
            }

            res.render('gestion', {
                lista : lista
            });
    });
});

//pagina de gestion de usuarios para el administrador (aqui es donde se cambia el rol de aspirante a coordinador)
app.post('/gestion',(req,res) => {

    Usuario.findOneAndUpdate({documento : req.body.documento}, req.body.rol == 'ASPIRANTE' ? {$set:{rol:"COORDINADOR"}} : {$set:{rol:"ASPIRANTE"}} , {new : true}, (err , result) => {
        if (err) {
            res.render('gestion',{
                mensaje : err
            })
        }

        if (!result){
            return res.redirect('/');
        }

        res.render('gestionResult', {
            mensaje : 'Actualizado ' + result.nombre +  ' exitozamente'
        })

    });

});

//pagina para recibir la respuesta de la operacion de cambio de rol a usuario
app.get('/gestionResult',(req,res) => {
    res.render('gestionResult');
});

//pagina para listar los cursos para los COORDINADORES
app.get('/verCursos',(req,res) => {
    Curso.find({}).exec(
        (err, lista) => {

           if (err) {
               res.render('verCursos',{
                   mensaje : err
               })
           }

           res.render('verCursos', {
               lista : lista
           });
   });
});

//pagina para crear los cursos para los COORDINADORES
app.get('/crearCurso',(req,res) => {
    res.render('crearCurso');
});

//pagina para crear los cursos para los COORDINADORES
app.post('/crearCurso',(req,res) => {

    let curso = new Curso({
            id : req.body.idCurso,
            nombre : req.body.nombre,
            descripcion : req.body.descripcion,
            inversion : req.body.costo,
            modalidad : req.body.modalidad,
            cargaHoraria : req.body.horas,
            estado : req.body.estado
        }
    );
    
    curso.save( (err,resultado)=> {
        if (err){
            res.render('crearCurso',{
                mensaje : err
            })
        }
        res.render('crearCurso', {
            mensaje : 'El curso ' + resultado.nombre + ' se guardo exitosmente'
        })
    });
    

});

//pagina para detalle de los cursos para los interesados 
app.post('/indexDetalle',(req,res) => {
    Curso.findById(req.body.id, (err, curso) => {
        if (err) {
            res.render('indexDetalle',{
                mensaje : err
            })
        }

        res.render('indexDetalle', {
            curso : curso
        });

    });
});

// pagina donde un interesado va a inscribir un curso
app.get('/inscribirCurso',(req,res) => {
    Curso.find({estado : 'DISPONIBLE'}).exec(
        (err, lista) => {

           if (err) {
               res.render('inscribirCurso',{
                   mensaje : err
               })
           }

           res.render('inscribirCurso', {
               lista : lista ,
               nombre : req.session.nombre,
               telefono : req.session.telefono,
               correo : req.session.correo,
               documento : req.session.documento
           });
   });
});

//pagina para que los estudiantes modifiques los datos de BD de su usuario
app.get('/miPerfil',(req,res) => {
    res.render('miPerfil', {
        nombre : req.session.nombre,
        telefono : req.session.telefono,
        correo : req.session.correo,
        documento : req.session.documento
    });
});

//pagina para que los estudiantes modifiques los datos de BD de su usuario
app.post('/miPerfil',(req,res) => {
    
    Usuario.findOneAndUpdate({documento : req.body.documento}, req.body, {new : true}, (err , result) => {
        if (err) {
            res.render('miPerfil',{
                mensaje : err
            })
        }

        if (!result){
            res.render('miPerfil', {
                mensaje : 'No se fue posible actualizar ' + req.body.nombre +  ' no se encontro en la BD'
            })
        } else {

            req.session.nombre = result.nombre;
            req.session.telefono = result.telefono;
            req.session.correo = result.correo;            

            res.render('miPerfil', {
                mensaje : 'Se actualizado ' + result.nombre +  ' exitozamente',
                documento : result.documento,
                nombre : result.nombre,
                correo : result.correo,
                telefono : result.telefono
            })
        }
    })
});

//pagina para informar el resultado de una inscripcion cuando un aspirante se inscribe
app.post('/inscribirCursoResult',(req,res) => {

    let inscripcion = new Inscripcion({
            idCurso : req.body.curso,
            documento : req.body.numeroDocumento
        }
    );

    inscripcion.save( (err,resultado)=> {
        if (err){
            res.render('inscribirCursoResult',{
                mensaje : err
            })
        }
        res.render('inscribirCursoResult', {
            mensaje : 'Se proceso exitosamente la insripcion de documento ' + req.body.numeroDocumento + ' en el curso ' + req.body.curso
        })
    });

});

//pagina para que el coordinador liste las inscripciones
app.post('/verInscrciones',(req,res) => {
    
    Inscripcion.find({ idCurso : req.body.cursoIdInsc }).exec(
        (err, lista) => {
           if (err) {
               res.render('verInscrciones',{
                    mensaje : err
               })
           }
           
           let arrayDocumentos = lista.map ( a => a.documento );
           
           Usuario.find({'documento' : { $in : arrayDocumentos }}).exec ( 
               (err,resultado) => {
                if (err) {
                    res.render('verInscrciones',{
                         mensaje : err
                    })
                }

                res.render('verInscrciones', {
                    lista : lista,
                    cursoIdInsc : req.body.cursoIdInsc,
                    cursoNombre : req.body.cursoNombre,
                    datosEstudiantes : resultado
                });
           });
           
   });
});

// pagina para mostrar el resultado de eliminar una inscripcion
app.post('/eliminarInscripcionResult',(req,res) => {

    Inscripcion.findOneAndDelete({ idCurso : req.body.cursoIdInsc, documento : req.body.documento}, req.body , 
        (err , result) => {
            if (err) {
                res.render('eliminarInscripcionResult',{
                    mensaje : err
                })
            }

            if (!result){
                res.render('eliminarInscripcionResult', {
                    mensaje : 'Imposible eliminar esa inscripcion, verifique documento y identificador del curso'
                }) 
            }else {
                res.render('eliminarInscripcionResult', {
                    mensaje : 'La inscripcion del estudiante con documento ' + result.documento + ' fue eliminado exitosamente',
                })
            }
    })

});

//manegar el request para cambiar el estado a un curso usado por el coordinador
app.post('/gestionCursoResult',(req,res) => {

    Curso.findByIdAndUpdate(req.body.cursoId, req.body.estadoCurso == 'DISPONIBLE' ? {$set:{estado:"CERRADO"}} : {$set:{estado:"DISPONIBLE"}} , {new : true}, 
        (err , result) => {
            if (err) {
                res.render('gestionCursoResult',{
                    mensaje : err
                })
            }

            if (!result){
                res.render('gestionCursoResult', {
                    mensaje : 'El curso ' + result.nombre +  ' no existe en la BD'
                })
            } else {
                 
                res.render('gestionCursoResult', {
                    mensaje : 'Se actualizado el curso ' + result.nombre +  ' exitosamente a ' + result.estado
                })

                io.emit("datosCurso", {
                            nombreCurso : result.nombre,
                            estadoCurso: result.estado
                            })            
            }
    });

});

//request para que los usuarios puedan ver sus cursos
app.get('/misCursos',(req,res) => {
    
    Inscripcion.find({ documento : req.session.documento }).exec(
        (err, lista) => {
           if (err) {
               res.render('misCursos',{
                    mensaje : err
               })
           }
           
           let arrayCursos = lista.map ( a => a.idCurso );
  
           Curso.find({'_id' : { $in : arrayCursos }}).exec (
               (err,resultado) => {

                console.log(resultado);

                if (err) {
                    res.render('misCursos',{
                         mensaje : err
                    })
                }

                res.render('misCursos', {
                    lista : resultado,
                    nombre : req.session.nombre
                });
           });
    
        });
});

//coordinador descarga hoja de vida
app.get('/download', function(req, res){
    
    Usuario.find({documento : req.query.documento}).exec( (err, estudianteList) => {

        if (err) {
            res.render('verInscrciones',{
                mensaje : err
            })
        }

        let estudiante = estudianteList[0];

        var fileContents = Buffer.from(estudiante.hojaVida, "base64");
        var savedFilePath = 'public/tmp/' + req.query.documento +'.pdf';
        fs.writeFile(savedFilePath, fileContents, function() {
            res.status(200).download(savedFilePath, req.query.documento +'.pdf');
        });   
   });
});


// ------------- salida cerrar session y manejo de url invalidas

//manage get request for /salir
app.get('/salir',(req,res) => {
    req.session.destroy( (err,result) => {
        return res.redirect('/');
      });
});

//para manejar error en cualquier pagina no especificada
app.get('*',(req,res) => {
    res.render('error', {
        estudiante: 'Error'
    })
});

// ------------- iniciar el servidor express

//inciar la aplicacion
server.listen( process.env.PORT , () => {
    console.log('Escuchando por el puerto 3000');
});