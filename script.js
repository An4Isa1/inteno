const pensum = [
  {
    semestre: 1,
    materias: [
      { nombre: "Introducción a la Economía", requisitos: [] },
      { nombre: "Matemáticas I", requisitos: [] },
      { nombre: "Contabilidad General", requisitos: [] },
      { nombre: "Administración General", requisitos: [] },
      { nombre: "Cátedra UMNG", requisitos: [] }
    ]
  },
  {
    semestre: 2,
    materias: [
      { nombre: "Microeconomía I", requisitos: ["Introducción a la Economía", "Matemáticas I"] },
      { nombre: "Matemáticas II", requisitos: ["Matemáticas I"] },
      { nombre: "Contabilidad de Costos", requisitos: ["Contabilidad General"] },
      { nombre: "Estadística I", requisitos: ["Matemáticas I"] },
      { nombre: "Lectura y Escritura Académica", requisitos: [] }
    ]
  },
  {
    semestre: 3,
    materias: [
      { nombre: "Microeconomía II", requisitos: ["Microeconomía I", "Matemáticas II"] },
      { nombre: "Macroeconomía I", requisitos: ["Microeconomía I"] },
      { nombre: "Matemáticas III", requisitos: ["Matemáticas II"] },
      { nombre: "Estadística II", requisitos: ["Estadística I"] },
      { nombre: "Contabilidad Financiera", requisitos: ["Contabilidad de Costos"] }
    ]
  },
  {
    semestre: 4,
    materias: [
      { nombre: "Econometría I", requisitos: ["Estadística II", "Matemáticas III"] },
      { nombre: "Macroeconomía II", requisitos: ["Macroeconomía I"] },
      { nombre: "Historia Económica General", requisitos: [] },
      { nombre: "Teoría de Juegos", requisitos: ["Microeconomía II"] },
      { nombre: "Electiva I", requisitos: [] }
    ]
  },
  {
    semestre: 5,
    materias: [
      { nombre: "Economía Colombiana", requisitos: ["Historia Económica General"] },
      { nombre: "Econometría II", requisitos: ["Econometría I"] },
      { nombre: "Investigación de Operaciones", requisitos: ["Matemáticas III"] },
      { nombre: "Teoría Monetaria", requisitos: ["Macroeconomía II"] },
      { nombre: "Formulación y Evaluación de Proyectos", requisitos: ["Contabilidad Financiera"] }
    ]
  },
  {
    semestre: 6,
    materias: [
      { nombre: "Política Económica", requisitos: ["Macroeconomía II", "Economía Colombiana"] },
      { nombre: "Desarrollo Económico", requisitos: ["Macroeconomía II"] },
      { nombre: "Electiva II", requisitos: [] },
      { nombre: "Economía Internacional", requisitos: ["Microeconomía II"] },
      { nombre: "Matemática Financiera", requisitos: ["Matemáticas III"] }
    ]
  },
  {
    semestre: 7,
    materias: [
      { nombre: "Seminario de Investigación I", requisitos: ["Econometría II"] },
      { nombre: "Economía del Sector Público", requisitos: ["Microeconomía II"] },
      { nombre: "Gestión Pública", requisitos: ["Administración General"] },
      { nombre: "Electiva III", requisitos: [] },
      { nombre: "Electiva IV", requisitos: [] }
    ]
  },
  {
    semestre: 8,
    materias: [
      { nombre: "Seminario de Investigación II", requisitos: ["Seminario de Investigación I"] },
      { nombre: "Electiva V", requisitos: [] },
      { nombre: "Electiva VI", requisitos: [] },
      { nombre: "Práctica Profesional", requisitos: ["Seminario de Investigación I"] }
    ]
  },
  {
    semestre: 9,
    materias: [
      { nombre: "Trabajo de Grado", requisitos: ["Seminario de Investigación II"] },
      { nombre: "Electiva VII", requisitos: [] },
      { nombre: "Electiva VIII", requisitos: [] }
    ]
  }
];

const estado = JSON.parse(localStorage.getItem("estadoPensum")) || {};

function guardarEstado() {
  localStorage.setItem("estadoPensum", JSON.stringify(estado));
}

function crearMateria(materia, semestre) {
  const div = document.createElement("div");
  div.className = "materia";
  div.textContent = materia.nombre;

  const requisitosCumplidos = materia.requisitos.every(req => estado[req]?.aprobada);

  if (!requisitosCumplidos) {
    div.classList.add("bloqueada");
  }

  if (estado[materia.nombre]?.aprobada) {
    div.classList.add("aprobada");
    div.textContent += ` (Prof: ${estado[materia.nombre].profesor}, Prom: ${estado[materia.nombre].promedio})`;
  }

  div.onclick = () => {
    if (!requisitosCumplidos || estado[materia.nombre]?.aprobada) return;

    const notas = [];
    for (let i = 1; i <= 3; i++) {
      const nota = parseFloat(prompt(`Ingrese la nota del corte ${i} para ${materia.nombre}`));
      if (isNaN(nota)) return;
      notas.push(nota);
    }

    const profesor = prompt(`Ingrese el nombre del profesor para ${materia.nombre}`);
    const promedio = (notas.reduce((a, b) => a + b, 0) / 3).toFixed(2);

    estado[materia.nombre] = { aprobada: true, profesor, promedio };
    guardarEstado();
    location.reload();
  };

  return div;
}

function crearSemestres() {
  const contenedor = document.getElementById("contenedor");
  pensum.forEach(bloque => {
    const div = document.createElement("div");
    div.className = `semestre semestre-${bloque.semestre}`;

    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${bloque.semestre}`;
    div.appendChild(titulo);

    bloque.materias.forEach(materia => {
      div.appendChild(crearMateria(materia, bloque.semestre));
    });

    contenedor.appendChild(div);
  });
}

document.getElementById("reiniciar").onclick = () => {
  if (confirm("¿Estás seguro de que deseas reiniciar tu progreso?")) {
    localStorage.clear();
    location.reload();
  }
};

crearSemestres();
