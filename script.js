const materiasPorSemestre = {
  1: [
    { nombre: "Matemáticas I" },
    { nombre: "Introducción a la Economía" },
    { nombre: "Fundamentos de Administración" },
    { nombre: "Contabilidad General" },
    { nombre: "Lectura y escritura académica" }
  ],
  2: [
    { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
    { nombre: "Microeconomía I", requisitos: ["Introducción a la Economía"] },
    { nombre: "Estadística I" },
    { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] },
    { nombre: "Historia económica" }
  ],
  3: [
    { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
    { nombre: "Microeconomía II", requisitos: ["Microeconomía I"] },
    { nombre: "Estadística II", requisitos: ["Estadística I"] },
    { nombre: "Macroeconomía I" },
    { nombre: "Economía Colombiana" }
  ],
  4: [
    { nombre: "Econometría I", requisitos: ["Estadística II"] },
    { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
    { nombre: "Teoría Monetaria" },
    { nombre: "Economía Ambiental" },
    { nombre: "Derecho Económico" }
  ],
  5: [
    { nombre: "Econometría II", requisitos: ["Econometría I"] },
    { nombre: "Evaluación de Proyectos" },
    { nombre: "Economía Internacional" },
    { nombre: "Formulación y Evaluación de Políticas Públicas" },
    { nombre: "Investigación I" }
  ],
  6: [
    { nombre: "Modelos de Equilibrio General" },
    { nombre: "Economía Pública" },
    { nombre: "Ética profesional" },
    { nombre: "Gestión Financiera Pública" },
    { nombre: "Investigación II", requisitos: ["Investigación I"] }
  ],
  7: [
    { nombre: "Seminario de Investigación I", requisitos: ["Investigación II"] },
    { nombre: "Electiva I" },
    { nombre: "Electiva II" },
    { nombre: "Optativa I" },
    { nombre: "Economía Regional" }
  ],
  8: [
    { nombre: "Seminario de Investigación II", requisitos: ["Seminario de Investigación I"] },
    { nombre: "Electiva III" },
    { nombre: "Optativa II" },
    { nombre: "Práctica Profesional" },
    { nombre: "Seminario de Coyuntura" }
  ],
  9: [
    { nombre: "Trabajo de Grado", requisitos: ["Seminario de Investigación II"] },
    { nombre: "Electiva IV" },
    { nombre: "Optativa III" }
  ]
};

const estado = JSON.parse(localStorage.getItem("estadoPensum")) || {};

function guardarEstado() {
  localStorage.setItem("estadoPensum", JSON.stringify(estado));
}

function calcularPromedio(n1, n2, n3) {
  return ((+n1 + +n2 + +n3) / 3).toFixed(2);
}

function crearMateria(materia, semestre) {
  const div = document.createElement("div");
  div.className = `materia semestre-${semestre}`;
  div.textContent = materia.nombre;

  if (estado[materia.nombre]) {
    div.classList.add("aprobada");
  }

  div.onclick = () => {
    if (estado[materia.nombre]) return;

    const requisitos = materia.requisitos || [];
    const noCumple = requisitos.some(req => !estado[req]);

    if (noCumple) {
      alert(`Debes aprobar: ${requisitos.join(", ")}`);
      return;
    }

    const n1 = prompt("Nota primer corte:");
    const n2 = prompt("Nota segundo corte:");
    const n3 = prompt("Nota tercer corte:");
    const prof = prompt("Nombre del profesor:");

    if ([n1, n2, n3, prof].some(v => v === null || v.trim() === "")) return;

    const prom = calcularPromedio(n1, n2, n3);
    estado[materia.nombre] = { promedio: prom, profesor: prof, semestre };
    div.classList.add("aprobada");
    actualizarResumen();
    guardarEstado();
  };

  return div;
}

function actualizarResumen() {
  const tbody = document.querySelector("#resumen tbody");
  tbody.innerHTML = "";

  for (const [nombre, datos] of Object.entries(estado)) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${datos.semestre}</td>
      <td>${nombre}</td>
      <td>${datos.promedio}</td>
      <td>${datos.profesor}</td>
    `;
    tbody.appendChild(tr);
  }
}

function reiniciarProgreso() {
  if (confirm("¿Reiniciar todo el progreso?")) {
    localStorage.removeItem("estadoPensum");
    location.reload();
  }
}

function cargarPensum() {
  const container = document.getElementById("pensum-container");
  for (let i = 1; i <= 9; i++) {
    const semestreDiv = document.createElement("div");
    semestreDiv.className = "semestre-container";

    materiasPorSemestre[i].forEach(m => {
      const materiaDiv = crearMateria(m, i);
      semestreDiv.appendChild(materiaDiv);
    });

    container.appendChild(semestreDiv);
  }
  actualizarResumen();
}

cargarPensum();
