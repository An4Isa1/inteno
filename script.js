const materias = [
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

function crearMateria(materia, nombreSemestre, i, j) {
  const div = document.createElement("div");
  div.className = "materia";
  div.textContent = materia.nombre;
  const estado = localStorage.getItem(materia.nombre);
  if (estado === "aprobada") div.classList.add("aprobada");

  div.addEventListener("click", () => {
    if (div.classList.contains("aprobada")) return;

    const requisitos = materia.requisitos || [];
    const noCumple = requisitos.filter(req => localStorage.getItem(req) !== "aprobada");
    if (noCumple.length > 0) {
      alert(`No puedes aprobar esta materia aún. Requisitos pendientes:\n${noCumple.join("\n")}`);
      return;
    }

    const notas = [];
    for (let i = 1; i <= 3; i++) {
      const nota = parseFloat(prompt(`Ingrese la nota del corte ${i} para ${materia.nombre}`));
      if (isNaN(nota) || nota < 0 || nota > 5) {
        alert("Nota inválida. Intente de nuevo.");
        return;
      }
      notas.push(nota);
    }

    const promedio = (notas.reduce((a, b) => a + b) / 3).toFixed(2);
    const profesor = prompt(`Ingrese el nombre del profesor de ${materia.nombre}:`);

    div.innerHTML = `
      ✅ ${materia.nombre}<br>
      Notas: ${notas.join(", ")}<br>
      Promedio: ${promedio}<br>
      Profesor: ${profesor}
    `;
    div.classList.add("aprobada");
    localStorage.setItem(materia.nombre, "aprobada");
  });

  return div;
}

function renderizarPensum() {
  const container = document.getElementById("pensum-container");
  container.innerHTML = "";

  const filaSuperior = document.createElement("div");
  filaSuperior.className = "fila-superior";
  const filaInferior = document.createElement("div");
  filaInferior.className = "fila-inferior";

  materias.forEach((semestre, index) => {
    const semestreDiv = document.createElement("div");
    semestreDiv.className = `semestre semestre-${index + 1}`;
    semestreDiv.innerHTML = `<h3>Semestre ${index + 1}</h3>`;

    semestre.forEach(materia => {
      const div = crearMateria(materia, index + 1);
      semestreDiv.appendChild(div);
    });

    if (index < 4) {
      filaSuperior.appendChild(semestreDiv);
    } else {
      filaInferior.appendChild(semestreDiv);
    }
  });

  container.appendChild(filaSuperior);
  container.appendChild(filaInferior);
}

function reiniciar() {
  if (confirm("¿Estás seguro que deseas reiniciar todo el progreso?")) {
    localStorage.clear();
    renderizarPensum();
  }
}

window.onload = renderizarPensum;
