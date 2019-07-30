# nodejsassingment3
despues de descargado debe ejecutar 
    1.- npm install para agregar todas las dependencias que estan en package.json

existen 4 roles
    1.- administrador unico usuario que puede cambiar el rol de otro usuario
    2.- interesado usuario que sin iniciar sesion puede ver las informacion de los cursos disponoibles
    3.- aspirante usuario que ya esta registrado en el sistema y puede o no tener una inscripcion en un curso 
    4.- coordinador usuario que ya esta registrado en el sistema, el administrador le cambio el rol, y este puede cerrar y/o habilitar cursos, eliminar inscripciones y crear cursos

Nota: 
1.- Los mensajes de confirmacion como usuairo creado exitosamente estan pero no son notorios por favor verificar bien la pantalla al hacer las acciones (esto es una posible mejora a futuro ponerlo en un popup)

2.- El login quedo con la cedula y la clave


Los usuarios existentes actualmente son 

DOCUMENTO       NOMBRE                   CORREO                  TELEFONO               ROL             CLAVE 
2345	        Admin	            admin@admin.com	            123456789	        ADMINISTRADOR       12345  
542567	        Marisabel Torres	marisabelt@hotmail.com	    3055920839	        COORDINADOR	        12345
555385	        Diego	            diegoramirez1@gmail.com	    3017952496	        ASPIRANTE	        12345
123	            estudiante2	        estuduante2@gmail.com	    12345	            ASPIRANTE           12345


recuerde que el documento debe ser unico