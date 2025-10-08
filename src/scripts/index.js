/* Array para almacenar eventos en memoria
let events = [
  {
    id: 1,
    title: "Reunión de equipo",
    description: "Revisión de proyecto mensual",
    date: "2025-10-15",
    time: "10:00",
    priority: "alta",
  },
  {
    id: 2,
    title: "Cita médica",
    description: "Chequeo general",
    date: "2025-10-20",
    time: "15:30",
    priority: "media",
  },
  {
    id: 3,
    title: "Cumpleaños de mi perro",
    description: "Celebración casual",
    date: "2025-10-25",
    time: "12:00",
    priority: "baja",
  },
]
*/
let nextId = 3

// Cargar eventos al iniciar
document.addEventListener("DOMContentLoaded", function () {
  displayEvents()
})

// Mostrar eventos
function displayEvents() {
  const eventList = document.getElementById("eventList")
  const emptyState = document.getElementById("emptyState")

  if (events.length === 0) {
    eventList.innerHTML = ""
    emptyState.style.display = "block"
    return
  }

  emptyState.style.display = "none"

  // Ordenar eventos por fecha y hora
  events.sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time)
    const dateB = new Date(b.date + " " + b.time)
    return dateA - dateB
  })

  eventList.innerHTML = events
    .map((event) => {
      const priorityColors = {
        baja: "success",
        media: "warning",
        alta: "danger",
      }

      const date = new Date(event.date)
      const formattedDate = date.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      return `
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center mb-2">
                                    <h5 class="mb-0 me-2">${event.title}</h5>
                                    <span class="badge bg-${
                                      priorityColors[event.priority]
                                    } priority-badge">
                                        ${event.priority.toUpperCase()}
                                    </span>
                                </div>
                                ${
                                  event.description
                                    ? `<p class="mb-2 text-muted">${event.description}</p>`
                                    : ""
                                }
                                <div class="event-date">
                                    <i class="fas fa-calendar"></i> ${formattedDate}
                                </div>
                                <div class="event-time">
                                    <i class="fas fa-clock"></i> ${event.time}
                                </div>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary" onclick="editEvent(${
                                  event.id
                                })" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${
                                  event.id
                                })" title="Eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `
    })
    .join("")
}

// Limpiar formulario
function clearForm() {
  document.getElementById("eventForm").reset()
  document.getElementById("eventId").value = ""
  document.getElementById("modalTitle").innerHTML =
    '<i class="fas fa-calendar-plus"></i> Nuevo Evento'
}

// Guardar evento
function saveEvent() {
  const id = document.getElementById("eventId").value
  const title = document.getElementById("eventTitle").value.trim()
  const description = document.getElementById("eventDescription").value.trim()
  const date = document.getElementById("eventDate").value
  const time = document.getElementById("eventTime").value
  const priority = document.getElementById("eventPriority").value

  if (!title || !date || !time) {
    alert("Por favor completa todos los campos requeridos")
    return
  }

  if (id) {
    // Editar evento existente
    const index = events.findIndex((e) => e.id === parseInt(id))
    events[index] = {
      id: parseInt(id),
      title,
      description,
      date,
      time,
      priority,
    }
  } else {
    // Agregar nuevo evento
    events.push({
      id: nextId++,
      title,
      description,
      date,
      time,
      priority,
    })
  }

  displayEvents()

  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("eventModal")
  )
  modal.hide()

  clearForm()
}

// Editar evento
function editEvent(id) {
  const event = events.find((e) => e.id === id)

  document.getElementById("eventId").value = event.id
  document.getElementById("eventTitle").value = event.title
  document.getElementById("eventDescription").value = event.description
  document.getElementById("eventDate").value = event.date
  document.getElementById("eventTime").value = event.time
  document.getElementById("eventPriority").value = event.priority

  document.getElementById("modalTitle").innerHTML =
    '<i class="fas fa-edit"></i> Editar Evento'

  const modal = new bootstrap.Modal(document.getElementById("eventModal"))
  modal.show()
}

// Eliminar evento
function deleteEvent(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
    events = events.filter((e) => e.id !== id)
    displayEvents()
  }
}

// Limpiar formulario al cerrar modal
document
  .getElementById("eventModal")
  .addEventListener("hidden.bs.modal", clearForm)
