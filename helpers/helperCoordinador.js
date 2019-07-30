const hbs = require('hbs');

hbs.registerHelper('listarCursos',(lista) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> ID </th> \
        <th> Nombre </th> \
        <th> Descripcion </th> \
        <th> Inversion </th> \
        <th> Modalidad </th> \
        <th> Carga horaria </th> \
        <th> Estado </th> \
        <th> Accion </th> \
        <th> Inscripciones </th> \
        </thead>';
    
        texto = texto + '<tbody>';

        lista
        .forEach(curso => {
            texto =  texto +'<tr><td>' + curso.id + '</td>' +
                                '<td>' + curso.nombre + '</td>' +
                                '<td>' + curso.descripcion + '</td>' +
                                '<td>' + curso.inversion + '</td>' +
                                '<td>' + curso.modalidad + '</td>' +
                                '<td>' + curso.cargaHoraria + '</td>' +
                                '<td>' + curso.estado + '</td>' +
                                '<td>' + '<form action="/gestionCursoResult" method="POST">'
                                +'<button class="btn btn-primary">Cambiar Estado</button>'
                                + '<input name="cursoId" type="hidden" value="'+ curso._id +'">'
                                + '<input name="estadoCurso" type="hidden" value="'+ curso.estado +'">'
                                +'</form>'
                                + '</td>'
                                + '<td><form action="/verInscrciones" method="POST">'
                                +'<button class="btn btn-primary">Lista Inscritos</button>'
                                + '<input name="cursoIdInsc" type="hidden" value="'+ curso._id +'">'
                                + '<input name="cursoNombre" type="hidden" value="'+ curso.nombre +'">'
                                +'</form>'
                                +'</td> </tr>';
        });

        texto = texto +' </tbody> </table> ';

    return texto;

});


hbs.registerHelper('listarInscripciones',(listaInscritos,cursoIdInsc,datosEstudiantes) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Documento </th> \
        <th> Nombre </th> \
        <th> Correo </th> \
        <th> Telefono </th> \
        <th> Hoja de Vida </th> \
        <th> Accion </th> \
        </thead>';
    
        texto = texto + '<tbody>';

        listaInscritos
        .forEach(estudiante => {
            texto =  texto +'<tr><td>' + estudiante.documento + '</td>' +
                                '<td>' + datosEstudiantes.find(  est => est.documento == estudiante.documento).nombre + '</td>' +
                                '<td>' + datosEstudiantes.find(  est => est.documento == estudiante.documento).correo + '</td>' +
                                '<td>' + datosEstudiantes.find(  est => est.documento == estudiante.documento).telefono + '</td>' +

                                '<td><form action="/download" method="get">'
                                +'<button class="btn btn-primary">Ver HV</button>'
                                + '<input name="documento" type="hidden" value="'+ estudiante.documento +'">'
                                +'</form></td>'

                                +'<td><form action="/eliminarInscripcionResult" method="POST">'
                                +'<button class="btn btn-primary">Eliminar inscripcion</button>'
                                + '<input name="documento" type="hidden" value="'+ estudiante.documento +'">'
                                + '<input name="cursoIdInsc" type="hidden" value="'+ cursoIdInsc +'">'
                                +'</form></td>'
                                +'</tr>';
        });

        texto = texto +' </tbody> </table> ';

    return texto;

});
