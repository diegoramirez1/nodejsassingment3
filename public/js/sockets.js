socket=io()

socket.on("datosCurso", (datosCurso) =>{
    document.getElementById("warningInfo").innerHTML = "El curso " + datosCurso.nombreCurso + " se encuentra " + datosCurso.estadoCurso;
    document.getElementById("warningInfo").style.display = "block"

})