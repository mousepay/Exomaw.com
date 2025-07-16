// Inicializa Supabase 
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://jidiuirdoflaangizzzqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZGl1aXJkb2ZsYWFuZ2l6enFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzYxMTMsImV4cCI6MjA2MzQxMjExM30.XjugEll0yas4R3LLGFalfXH-KWX-8rryREJW_CKzctc';
const supabase = createClient(supabaseUrl, supabaseKey);

// ----------------- GRABAR AUDIO ----------------
let mediaRecorder;
let audioChunks = [];
let audioBlob;

const grabarBtn = document.getElementById("grabar");
const detenerBtn = document.getElementById("detener");
const descargarBtn = document.getElementById("descargar");
const audioPlayback = document.getElementById("audioPlayback");
const feedbackLectura = document.getElementById("feedbackLectura");
const audioLecturaPublica = document.getElementById("audioLecturaPublica");

let startTime, endTime;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e) {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstart = function () {
                startTime = new Date().getTime();
            };

            mediaRecorder.onstop = function () {
                endTime = new Date().getTime();
                const durationSeconds = (endTime - startTime) / 1000;

                if (durationSeconds < 3) {
                    feedbackLectura.textContent = "⏳ Demasiado corto. Intenta leer más.";
                } else if (durationSeconds > 30) {
                    feedbackLectura.textContent = "🕓 Muy largo. Trata de hacer pausas.";
                } else {
                    feedbackLectura.textContent = "✅ Buena duración.";
                }

                audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioPlayback.src = URL.createObjectURL(audioBlob);
                audioChunks = [];
            };
        })
        .catch(err => {
            alert("No se puede acceder al micrófono: " + err);
        });
} else {
    alert("Tu navegador no soporta grabación de voz.");
}

// ----------------- SUBIR A SUPABASE -----------------
async function subirAudio(blob, nombreArchivo) {
    const { data, error } = await supabase.storage
        .from('libros-audios')
        .upload(nombreArchivo, blob, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'audio/wav',
        });

    if (error) {
        console.error('Error subiendo a Supabase:', error);
    } else {
        console.log('Guardado correctamente en Supabase');
        alert('Audio guardado en Supabase');
    }
}

// ----------------- EVENTOS DE LOS BOTONES -----------------
grabarBtn.onclick = function () {
    audioChunks = [];
    mediaRecorder.start();
    grabarBtn.disabled = true;
    detenerBtn.disabled = false;
};

detenerBtn.onclick = function () {
    mediaRecorder.stop();
    grabarBtn.disabled = false;
    detenerBtn.disabled = true;
};

descargarBtn.onclick = function () {
    if (!audioBlob) return alert('Graba primero algo.');

    subirAudio(audioBlob, `mi-audio-${Date.now()}.wav`);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(audioBlob);
    a.download = "mi-lectura.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// ----------------- MODAL PARA LAS IMÁGENES -----------------
function openModal(src) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('imgModal');
    modal.style.display = "block";
    modalImg.src = src;
}

document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("myModal").style.display = "none";
});

window.addEventListener("click", function (event) {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// ----------------- SUBIR AUDIO MANUAL DESDE ORDENADOR -----------------
const subirArchivoBtn = document.getElementById("subirArchivoBtn");
const archivoInput = document.getElementById("archivoInput");

subirArchivoBtn.addEventListener("click", async () => {
    const archivo = archivoInput.files[0];
    if (!archivo) {
        alert("Selecciona primero un archivo .mp3 o .wav");
        return;
    }

    const nombreArchivo = `audio-subido-${Date.now()}.${archivo.name.split('.').pop()}`;

    const { data, error } = await supabase.storage
        .from('libros-audios')
        .upload(nombreArchivo, archivo, {
            cacheControl: '3600',
            upsert: true,
            contentType: archivo.type,
        });

    if (error) {
        console.error('Error subiendo audio:', error);
        alert('Error al subir tu audio');
    } else {
        const { data: urlData } = await supabase
            .storage
            .from('libros-audios')
            .getPublicUrl(nombreArchivo);

        const urlPublica = urlData.publicUrl;
        audioLecturaPublica.src = urlPublica;
        alert('Audio subido y vinculado correctamente ✅');
    }
});

// ----------------- BOTÓN DE ESCUCHAR TODO -----------------
document.querySelector(".btn-escuchar").addEventListener("click", () => {
    audioLecturaPublica.play();
});
// Reemplaza la fuente del audio manualmente para asegurarte que funciona
const audioPublico = document.getElementById("audioLecturaPublica");
audioPublico.src = "https://jidiuirdoflaangizzqb.supabase.co/storage/v1/object/public/libros-audios/Nuevo_proyecto%20(1).mp3";
// ----------------- CONTADOR DE LIBROS -----------------
async function contarLibros() {
    try {
        const { count, error } = await supabase
            .from('libros_usuarios')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Error al contar los libros:', error);
            return;
        }

        const contadorDiv = document.getElementById('contadorLibros');
        if (contadorDiv) {
            contadorDiv.textContent = `📚 Libros subidos: ${count}`;
        }
    } catch (err) {
        console.error('Error inesperado:', err);
    }
}

contarLibros();
// ----------------- CONTADOR DE LIBROS -----------------
async function contarLibros() {
    try {
        const { count, error } = await supabase
            .from('libros_usuarios')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Error al contar los libros:', error);
            return;
        }

        const contadorDiv = document.getElementById('contadorLibros');
        if (contadorDiv) {
            contadorDiv.textContent = `📚 Libros subidos: ${count}`;
        }
    } catch (err) {
        console.error('Error inesperado:', err);
    }
}

contarLibros();
async function guardarLibroEnSupabase(titulo, portadaURL, contraportadaURL, pagina1URL, pagina2URL, enlaceAmazon) {
    const { data, error } = await supabase
        .from('libros_usuarios')
        .insert([
            {
                titulo: titulo,
                portada_url: portadaURL,
                contraportada_url: contraportadaURL,
                pagina1_url: pagina1URL,
                pagina2_url: pagina2URL,
                enlace_amazon: enlaceAmazon,
                fecha_subida: new Date(),
                aprobado: false
            }
        ]);

    if (error) {
        console.error('Error al guardar libro:', error);
        alert('Error al guardar libro en la base de datos');
    } else {
        alert('¡Libro guardado correctamente en la base de datos!');
        contarLibros(); // Actualiza el contador
    }
}
// ----------------- OBTENER PENDIENTES -----------------
async function obtenerLibrosPendientes() {
    const { data, error } = await supabase
        .from('libros_usuarios')
        .select('*')
        .eq('aprobado', false);

    if (error) {
        console.error('Error obteniendo libros pendientes:', error);
        return;
    }
    console.log('Libros pendientes por aprobar:', data);
}
obtenerLibrosPendientes();

// ----------------- APROBAR LIBRO -----------------
async function aprobarLibro(idLibro) {
    const { error } = await supabase
        .from('libros_usuarios')
        .update({ aprobado: true })
        .eq('id', idLibro);

    if (error) {
        console.error('Error aprobando libro:', error);
    } else {
        alert('Libro aprobado correctamente ✅');
        contarLibros();
    }
}
