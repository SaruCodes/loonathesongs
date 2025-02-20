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
        error: function () {
            $("#song-list").html("<p style='color: red;'>Error al cargar las canciones. Inténtalo de nuevo más tarde.</p>");
        }
    });

    // Función para mostrar las canciones
    function mostrarCanciones(canciones) {
        let songList = $("#song-list");
        songList.empty();

        $.each(canciones, function (_, song) {
            let songContainer = `
                <div class="song-container" data-video="${song.video}" data-subunit="${song.subunit}">
                    <img src="${song.img}" alt="${song.titulo}" class="song-img">
                    <p class="song-title">${song.titulo}</p>
                </div>
            `;
            songList.append(songContainer);
        });
    }

    // Filtrar canciones por subunidad
    $("nav button").click(function () {
        $("nav button").removeClass("active-button");
        $(this).addClass("active-button");

        let subunit = $(this).text().toLowerCase();

        $(".song-container").each(function () {
            let cancionSubunit = $(this).data("subunit").toLowerCase();
            $(this).toggleClass("resaltar", cancionSubunit === subunit);
            $(this).toggleClass("noResaltada", cancionSubunit !== subunit);
        });
    });

    // Animación de los botones del nav (hover y pulsado)
    $("nav button").hover(
        function () {
            if (!$(this).hasClass("active-button")) {
                $(this).css({ backgroundColor: "#d74497c0", color: "#fff", transform: "scale(1)", transition: "background-color 0.3s ease, color 0.3s ease" });
            }
        },
        function () {
            if (!$(this).hasClass("active-button")) {
                $(this).css({ backgroundColor: "#fff", color: "#D74497", transform: "scale(1)" });
            }
        }
    );
    
    $("nav button").click(function () {
        $("nav button").removeClass("active-button").css({ backgroundColor: "#fff", color: "#D74497", borderBottom: "none", transform: "scale(1)"});
    
        $(this).addClass("active-button").css({ backgroundColor: "#d74497c0", color: "#fff", transform: "scale(1)" });
    });
    

    // Mostrar video con animación
    $(document).on("click", ".song-img", function () {
        if ($("#video-overlay").length === 0 && $(this).parent().hasClass("resaltar")) { // Verifica que no haya otro video activo
            let videoUrl = $(this).parent().data("video").replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1&controls=1&rel=0";
    
            $("body").append(`
                <div id="video-overlay">
                    <div id="video-container">
                        <div class="video-wrapper">
                            <iframe title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen src="${videoUrl}" class="video"></iframe>
                        </div>
                        <button id="boton-cerrar" class="boton-cerrar">Cerrar</button>
                    </div>
                    <div id="close-instruction" class="instruction">Pulse Esc para cerrar</div>
                </div>
            `);
    
            let imgOffset = $(this).offset();
            $("#video-container").css({ position: "fixed", top: imgOffset.top, left: imgOffset.left, width: "0px", height: "0px" });
    
            let finalWidth = $(window).width() * 0.5;
            let finalHeight = finalWidth * 0.5625;
            let finalTop = ($(window).height() - finalHeight) / 2;
            let finalLeft = ($(window).width() - finalWidth) / 2;
    
            $("#video-container").animate({ top: finalTop, left: finalLeft, width: finalWidth, height: finalHeight }, 400);
        }
    });
    

    // Cerrar video con botón, fondo o tecla ESC
    $(document).on("click", "#boton-cerrar, #video-overlay", function (e) {
        if (e.target.id === "video-overlay" || e.target.id === "boton-cerrar") {
            $("#video-overlay").remove();
        }
    });

    $(document).keydown(function (event) {
        if (event.which == 27) {
            $("#video-overlay").remove();
        }
    });

    // Mostrar todas las canciones al hacer clic en el logo
    $("header img").click(function () {
        $("nav button").removeClass("active-button");
        mostrarCanciones(datosJson);
        $(".song-container").removeClass("resaltar noResaltada");
    });

});
