$(document).ready(function () {
    let datosJson = [];

    // Cargar los datos del JSON usando AJAX
    $.ajax({
        url: "loona.json",
        dataType: "json",
        success: function (data) {
            datosJson = data.canciones;
            mostrarCanciones(datosJson);
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar el JSON:", error);
        }
    });

    // Función para mostrar las canciones
    function mostrarCanciones(canciones) {
        let songList = $("#song-list");
        songList.empty();

        // Iteramos sobre las canciones y las agregamos al contenedor
        canciones.forEach(function (song) {
            let songContainer = `
                <div class="song-container" data-video="${song.video}" data-subunit="${song.subunit}">
                    <img src="${song.img}" alt="${song.titulo}" class="song-img">
                    <p class="song-title">${song.titulo}</p>
                </div>
            `;
            songList.append(songContainer);  // Agregamos el contenedor de la canción al listado
        });
    }

    // Filtrar canciones por subunidad cuando se hace clic en un botón de navegación
    $("nav button").click(function () {
        let subunit = $(this).text(); 
        $("nav button").removeClass("active-button");
        $(this).addClass("active-button");

        $(".song-container").each(function () {
            let cancionSubunit = $(this).data("subunit");
            if (cancionSubunit.toLowerCase() === subunit.toLowerCase()) {
                $(this).addClass("resaltar").removeClass("noResaltada");
            } else {
                $(this).removeClass("resaltar").addClass("noResaltada");
            }
        });
    });

    // Mostrar el video con animación y sin ocupar toda la pantalla
    $(document).on("click", ".song-img", function () {

        if ($(this).parent().hasClass("resaltar")) {
            let videoUrl = $(this).parent().data("video").replace("youtu.be/", "www.youtube.com/embed/");
            let params = "?autoplay=1&controls=1&rel=0";

            let $video = $('<iframe title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>');
            $video.attr("src", videoUrl + params);
            $video.addClass("video");
            $("body").append(`
                <div id="video-overlay">
                    <div id="video-container">
                        <div class="video-wrapper">
                            ${$video[0].outerHTML}
                        </div>
                        <button id="boton-cerrar" class="boton-cerrar">Cerrar</button>
                    </div>
                </div>
            `);            

            let initialWidth = 0;
            let initialHeight = 0;
            let imgOffset = $(this).offset();

            $("#video-container").css({
                position: "fixed",
                top: imgOffset.top,
                left: imgOffset.left,
                width: initialWidth + "px", 
                height: initialHeight + "px",  
            });

            // Animamos el iframe a un tamaño final centrado en la pantalla con una relación de 16:9
            let finalWidth = $(window).width() * 0.5; 
            let finalHeight = finalWidth * 0.5625;
            let finalTop = ($(window).height() - finalHeight) / 2; 
            let finalLeft = ($(window).width() - finalWidth) / 2;

            // Animamos el iframe desde su tamaño inicial hasta el tamaño final
            $("#video-container").animate({
                top: finalTop,
                left: finalLeft,
                width: finalWidth,
                height: finalHeight
            }, 400);
        }
    });

    //Cerrar el video (click en boton, en el fondo y esc)
    $(document).on("click", "#boton-cerrar", function () {
        $("#video-overlay").remove();
    });

    $(document).on("click", "#video-overlay", function (e) {
        if (e.target === this) {  // Si el clic fue fuera del iframe
            $("#video-overlay").remove(); 
        }
    });

    $(document).keydown(function (event) {
        if (event.which == 27) {
            $("#video-overlay").remove();
        }
    });

    //Mostrar todo cuando presionas el logo
    $("header img").click(function () {
        $("nav button").removeClass("active-button");
        mostrarCanciones(datosJson);
        $(".song-container").removeClass("resaltar noResaltada");
    });
});
