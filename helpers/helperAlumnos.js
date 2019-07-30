const hbs = require('hbs');

hbs.registerHelper('listarCursosIndex',(lista) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Nombre </th> \
        <th> Descripcion </th> \
        <th> Inversion </th> \
        <th> Accion </th> \
        </thead>';
    
        texto = texto + '<tbody>';

        lista
        .forEach(curso => {
            texto =  texto +'<tr><td>' + curso.nombre + '</td>' +
                                '<td>' + curso.descripcion + '</td>' +
                                '<td>' + curso.inversion + '</td>' +
                                '<td>' + '<form action="/indexDetalle" method="POST">'
                                                +'<button class="btn btn-primary">Ver detalles</button>'
                                                + '<input name="id" type="hidden" value="'+ curso._id +'">'
                                        +'</form>'
                                +'</td></tr>';
        });

        texto = texto +' </tbody> </table> ';

    return texto;

});

hbs.registerHelper('listarCursosDetalle',(curso) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Nombre </th> \
        <th> Descripcion </th> \
        <th> Inversion </th> \
        <th> Modalidad </th> \
        <th> Carga horaria </th> \
        </thead>';
    
        texto = texto + '<tbody>';

            texto =  texto +'<tr><td>' + curso.nombre + '</td>' +
                                '<td>' + curso.descripcion + '</td>' +
                                '<td>' + curso.inversion + '</td>' +
                                '<td>' + curso.modalidad + '</td>' +
                                '<td>' + curso.cargaHoraria + '</td></tr>';

        texto = texto +' </tbody> </table> ';

    return texto;

});

hbs.registerHelper('listarCursosInscripcion',(lista) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Nombre </th> \
        <th> Descripcion </th> \
        <th> Inversion </th> \
        <th> Modalidad </th> \
        <th> Carga horaria </th> \
        <th> Seleccionar </th> \
        </thead>';
    
        texto = texto + '<tbody>';

        lista
        .forEach(curso => {
            texto =  texto +'<tr><td>' + curso.nombre + '</td>' +
                                '<td>' + curso.descripcion + '</td>' +
                                '<td>' + curso.inversion + '</td>' +
                                '<td>' + curso.modalidad + '</td>' +
                                '<td>' + curso.cargaHoraria + '</td>' +
                                '<td>' + '<input type="radio" name="curso" value="'+ curso._id +'" required>' +
                                '</td></tr>';
        });

        texto = texto +' </tbody> </table> ';

    return texto;

});

hbs.registerHelper('listarCursosInscritoEstudiante',(lista) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Nombre </th> \
        <th> Descripcion </th> \
        <th> Inversion </th> \
        <th> Modalidad </th> \
        <th> Carga horaria </th> \
        </thead>';
    
        texto = texto + '<tbody>';

        lista
        .forEach(curso => {
            texto =  texto +'<tr><td>' + curso.nombre + '</td>' +
                                '<td>' + curso.descripcion + '</td>' +
                                '<td>' + curso.inversion + '</td>' +
                                '<td>' + curso.modalidad + '</td>' +
                                '<td>' + curso.cargaHoraria + '</td></tr>';
        });

        texto = texto +' </tbody> </table> ';

    return texto;

});