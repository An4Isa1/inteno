// Datos de ejemplo de materias completas por semestre
const materias = {
    1: [
        { nombre: "Matemáticas I", requisitos: [] },
        { nombre: "Fundamentos de Economía", requisitos: [] },
        { nombre: "Contabilidad General", requisitos: [] },
        { nombre: "Cátedra Rafael Núñez", requisitos: [] },
        { nombre: "Introducción a las Ciencias Sociales", requisitos: [] }
    ],
    2: [
        { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
        { nombre: "Microeconomía I", requisitos: ["Fundamentos de Economía"] },
        { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] },
        { nombre: "Historia Económica General", requisitos: [] },
        { nombre: "Estadística I", requisitos: ["Matemáticas I"] }
    ],
    3: [
        { nombre: "Macroeconomía I", requisitos: ["Fundamentos de Economía"] },
        { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
        { nombre: "Estadística II", requisitos: ["Estadística I"] },
        { nombre: "Microeconomía II", requisitos: ["Microeconomía I"] },
        { nombre: "Contabilidad Nacional", requisitos: ["Contabilidad de Costos"] }
    ],
    4: [
        { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
        { nombre: "Econometría I", requisitos: ["Estadística II"] },
        { nombre: "Economía Colombiana", requisitos: ["Historia Económica General"] },
        { nombre: "Teoría Monetaria", requisitos: ["Macroeconomía I"] },
        { nombre: "Economía Matemática", requisitos: ["Matemáticas III"] }
    ],
    5: [
        { nombre: "Formulación y Evaluación de Proyectos", requisitos: ["Contabilidad Nacional"] },
        { nombre: "Econometría II", requisitos: ["Econometría I"] },
        { nombre: "Historia Económica de Colombia", requisitos: ["Economía Colombiana"] },
        { nombre: "Economía Internacional", requisitos: ["Microeconomía II"] },
        { nombre: "Epistemología", requisitos: [] }
    ],
    6: [
        { nombre: "Seminario de Investigación I", requisitos: [] },
        { nombre: "Pensamiento Económico I", requisitos: [] },
        { nombre: "Geografía Económica", requisitos: [] },
        { nombre: "Métodos Cuantitativos", requisitos: ["Econometría II"] },
        { nombre: "Electiva I", requisitos: [] }
    ],
    7: [
        { nombre: "Seminario de Investigación II", requisitos: ["Seminario de Investigación I"] },
        { nombre: "Pensamiento Económico II", requisitos: ["Pensamiento Económico I"] },
        { nombre: "Electiva II", requisitos: ["Electiva I"] },
        { nombre: "Trabajo de Grado I", requisitos: [] }
    ],
    8: [
        { nombre: "Política Económica", requisitos: ["Economía Internacional"] },
        { nombre: "Ética Profesional", requisitos: [] },
        { nombre: "Electiva III", requisitos: ["Electiva II"] },
        { nombre: "Trabajo de Grado II", requisitos: ["Trabajo de Grado I"] }
    ],
    9: [
        { nombre: "Práctica Profesional", requisitos: ["Trabajo de Grado II"] },
        { nombre: "Electiva IV", requisitos: ["Electiva III"] },
        { nombre: "Electiva V", requisitos: ["Electiva IV"] }
    ]
};

// Cargar estado desde localStorage
let estado = JSON.parse(localStorage.getItem("estadoMaterias")) || {};

// Función para crear las materias
function crearMaterias() {
    const container = document.getElementById("pensum");

    for (let semestre = 1; semestre <= 9; semestre++) {
        const semestreDiv = document.createElement("div");
        semestreDiv.classList.add("semestre", `semestre-${semestre}`);

        const titulo = document.createElement("h3");
        titulo.textContent = `Semestre ${semestre}`;
        semestreDiv.appendChild(titulo);

        materias[semestre].forEach(materia => {
            const materiaDiv = document.createElement("div");
            materiaDiv.classList.add("materia");

            const estadoMateria = estado[materia.nombre];

            const aprobada = estadoMateria?.aprobada;
            const desbloqueada = materia.requisitos.every(req => estado[req]?.aprobada);

            materiaDiv.classList.add(aprobada ? "aprobada" : desbloqueada ? "desbloqueada" : "bloqueada");

            materiaDiv.innerHTML = `
                <strong>${materia.nombre}</strong>
                <div class="info" style="display: none;">
                    ${!aprobada && desbloqueada ? `
                        <label>Nota Corte 1: <input type="number" class="nota" data-corte="1"></label>
                        <label>Nota Corte 2: <input type="number" class="nota" data-corte="2"></label>
                        <label>Nota Corte 3: <input type="number" class="nota" data-corte="3"></label>
                        <label>Profesor: <input type="text" class="profesor"></label>
                        <button class="guardar">Guardar</button>
                    ` : aprobada ? `
                        <p>Profesor: ${estadoMateria.profesor}</p>
                        <p>Notas: ${estadoMateria.notas.join(", ")}</p>
                        <p>Promedio: ${estadoMateria.promedio.toFixed(2)}</p>
                    ` : `
                        <p>Requiere: ${materia.requisitos.join(", ") || "Ninguno"}</p>
                    `}
                </div>
            `;

            materiaDiv.addEventListener("click", () => {
                const info = materiaDiv.querySelector(".info");
                if (info) info.style.display = info.style.display === "none" ? "block" : "none";
            });

            const guardarBtn = materiaDiv.querySelector(".guardar");
            if (guardarBtn) {
                guardarBtn.addEventListener("click", () => {
                    const notas = [...materiaDiv.querySelectorAll(".nota")].map(input => parseFloat(input.value));
                    const profesor = materiaDiv.querySelector(".profesor").value;
                    const promedio = (notas.reduce((a, b) => a + b, 0)) / 3;

                    if (notas.some(isNaN) || !profesor) {
                        alert("Por favor, completa todas las notas y el nombre del profesor.");
                        return;
                    }

                    if (promedio >= 3.0) {
                        estado[materia.nombre] = { aprobada: true, notas, promedio, profesor };
                        localStorage.setItem("estadoMaterias", JSON.stringify(estado));
                        alert("Materia aprobada.");
                        location.reload();
                    } else {
                        alert("No alcanzaste el promedio mínimo para aprobar (3.0)");
                    }
                });
            }

            semestreDiv.appendChild(materiaDiv);
        });

        container.appendChild(semestreDiv);
    }
}

// Función para reiniciar el progreso
function reiniciarProgreso() {
    if (confirm("¿Seguro que deseas reiniciar todo el progreso?")) {
        localStorage.removeItem("estadoMaterias");
        location.reload();
    }
}

document.getElementById("reiniciar").addEventListener("click", reiniciarProgreso);

// Ejecutar al cargar
crearMaterias();
