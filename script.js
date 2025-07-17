const pensum = [
  [
    { nombre: "Economía I (Introducción a la Economía)", requisitos: [] },
    { nombre: "Historia Económica General", requisitos: [] },
    { nombre: "Matemáticas I", requisitos: [] },
    { nombre: "Expresión Oral y Escrita", requisitos: [] },
    { nombre: "Metodología de la Investigación", requisitos: [] },
    { nombre: "Cátedra Neogranadina", requisitos: [] },
    { nombre: "Principios Constitucionales", requisitos: [] }
  ],
  [
    { nombre: "Microeconomía I", requisitos: ["Economía I (Introducción a la Economía)"] },
    { nombre: "Historia Económica Colombiana", requisitos: ["Historia Económica General"] },
    { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
    { nombre: "Estadística I", requisitos: [] },
    { nombre: "Álgebra Lineal", requisitos: [] },
    { nombre: "Humanidades I", requisitos: [] },
    { nombre: "Extensión Cultural y Deportiva", requisitos: [] }
  ],
  [
    { nombre: "Microeconomía II", requisitos: ["Microeconomía I"] },
    { nombre: "Macroeconomía I", requisitos: ["Microeconomía I"] },
    { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
    { nombre: "Estadística II", requisitos: ["Estadística I"] },
    { nombre: "Medición Económica", requisitos: ["Microeconomía I"] }
  ],
  [
    { nombre: "Microeconomía III", requisitos: ["Microeconomía II"] },
    { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
    { nombre: "Economía Matemática", requisitos: ["Matemáticas III"] },
    { nombre: "Estadística III", requisitos: ["Estadística I"] },
    { nombre: "Contabilidad General", requisitos: [] }
  ],
  [
    { nombre: "Macroeconomía III", requisitos: ["Microeconomía III", "Macroeconomía II", "Economía Matemática"] },
    { nombre: "Doctrinas Económicas I", requisitos: [] },
    { nombre: "Econometría I", requisitos: [] },
    { nombre: "Énfasis I", requisitos: [] },
    { nombre: "Matemáticas Financieras", requisitos: ["Estadística III"] },
    { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] }
  ],
  [
    { nombre: "Crecimiento Económico", requisitos: ["Macroeconomía III"] },
    { nombre: "Doctrinas Económicas II", requisitos: ["Doctrinas Económicas I"] },
    { nombre: "Econometría II", requisitos: [] },
    { nombre: "Énfasis II", requisitos: [] },
    { nombre: "Teoría de la Decisión", requisitos: [] },
    { nombre: "Análisis Financiero", requisitos: ["Contabilidad de Costos"] }
  ],
  [
    { nombre: "Teoría y Política Fiscal", requisitos: ["Crecimiento Económico"] },
    { nombre: "Desarrollo Económico", requisitos: [] },
    { nombre: "Teoría y Política Monetaria y Cambiaria", requisitos: [] },
    { nombre: "Énfasis III", requisitos: [] },
    { nombre: "Formulación y Evaluación de Proyectos", requisitos: [] },
    { nombre: "Humanidades II", requisitos: [] }
  ],
  [
    { nombre: "Electiva I en lo Público", requisitos: [] },
    { nombre: "Electiva I en lo Económico", requisitos: [] },
    { nombre: "Economía Internacional", requisitos: [] },
    { nombre: "Énfasis IV", requisitos: [] },
    { nombre: "Evaluación Económica y Social de Proyectos", requisitos: [] },
    { nombre: "Ética Profesional", requisitos: [] }
  ],
  [
    { nombre: "Electiva II en lo Público", requisitos: [] },
    { nombre: "Electiva II en lo Económico", requisitos: [] },
    { nombre: "Electiva en lo Internacional", requisitos: [] },
    { nombre: "Electiva de Énfasis", requisitos: ["Estadística I"] },
    { nombre: "Seminario de Grado", requisitos: [] }
  ]
];

function crearPensum() {
  const contenedor = document.getElementById("contenedor-semestres");
  contenedor.innerHTML = "";

  pensum.forEach((semestre, index) => {
    const div = document.createElement("div");
    div.className = `semestre semestre-${index + 1}`;

    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${index + 1}`;
    div.appendChild(titulo);

    semestre.forEach(materia => {
      const matDiv = document.createElement("div");
      matDiv.className = "materia";
      matDiv.textContent = materia.nombre;

      if (materiaAprobada(materia.nombre)) {
        matDiv.classList.add("completada");
      }

      matDiv.onclick = () => manejarMateria(materia, matDiv);
      div.appendChild(matDiv);
    });

    contenedor.appendChild(div);
  });

  actualizarResumen();
}

function materiaAprobada(nombre) {
  const estado = JSON.parse(localStorage.getItem("estadoPensum") || "{}");
  return estado[nombre]?.aprobada;
}

function manejarMateria(materia, elemento) {
  const requisitosCumplidos = materia.requisitos.every(r => materiaAprobada(r));
  if (!requisitosCumplidos) {
    alert("Debes aprobar los requisitos: " + materia.requisitos.join(", "));
    return;
  }

  const notas = [];
  for (let i = 1; i <= 3; i++) {
    const nota = parseFloat(prompt(`Ingresa la nota del corte ${i} para ${materia.nombre}`));
    if (isNaN(nota)) return;
    notas.push(nota);
  }

  const promedio = notas.reduce((a, b) => a + b) / 3;
  const profesor = prompt("Ingresa el nombre del profesor");

  const estado = JSON.parse(localStorage.getItem("estadoPensum") || "{}");
  estado[materia.nombre] = { aprobada: true, notas, promedio, profesor };
  localStorage.setItem("estadoPensum", JSON.stringify(estado));

  crearPensum();
}

function reiniciarProgreso() {
  if (confirm("¿Seguro que quieres reiniciar todo el progreso?")) {
    localStorage.removeItem("estadoPensum");
    crearPensum();
  }
}

function actualizarResumen() {
  const tabla = document.getElementById("tablaResumen");
  const estado = JSON.parse(localStorage.getItem("estadoPensum") || "{}");

  let html = "";
  pensum.forEach((semestre, idx) => {
    html += `<h4>Semestre ${idx + 1}</h4><ul>`;
    semestre.forEach(m => {
      if (estado[m.nombre]?.aprobada) {
        html += `<li>${m.nombre}: ${estado[m.nombre].promedio.toFixed(2)} (Prof: ${estado[m.nombre].profesor})</li>`;
      }
    });
    html += "</ul>";
  });

  tabla.innerHTML = html;
}

crearPensum();
