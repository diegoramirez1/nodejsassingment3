const hbs = require('hbs');

hbs.registerHelper('listarUsuarios',(lista) => {
    
    let texto = ' <table class="table table-striped table-hover"> \
        <thead class="thead-dark"> \
        <th> Documento </th> \
        <th> Nombre </th> \
        <th> Correo </th> \
        <th> Telefono </th> \
        <th> Rol </th> \
        <th> Accion </th> \
        </thead>';
    
        texto = texto + '<tbody>';


        lista
        .forEach(usuario => {
            texto =  texto +'<tr><td>' + usuario.documento + '</td>' +
                                '<td>' + usuario.nombre + '</td>' +
                                '<td>' + usuario.correo + '</td>' +
                                '<td>' + usuario.telefono + '</td>' +
                                '<td>' + usuario.rol + '</td>';
                                if (usuario.rol != 'ADMINISTRADOR') {
            texto =  texto +        '<td>' + '<form action="/gestion" method="POST">'
                                    +'<button class="btn btn-primary">Cambiar Rol</button>'
                                    + '<input name="rol" type="hidden" value="'+ usuario.rol +'">'
                                    + '<input name="documento" type="hidden" value="'+ usuario.documento +'">'
                                    +'</form>'
                                    +'</td>';
                                }
            texto =  texto +    '</tr>';
        });
        texto = texto +' </tbody> </table> ';

     
    return texto;

});