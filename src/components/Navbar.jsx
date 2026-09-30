import { useState } from 'react'

/**
 * Navbar — barra de navegación superior.
 *
 * - totalUnidades llega como prop desde App (solo lectura).
 * - menuAbierto es estado LOCAL: a ningún otro componente le importa si el
 *   menú móvil está abierto, así que no se eleva a App.
 * - No se usa el JavaScript de Bootstrap (data-bs-toggle): la clase "show"
 *   se agrega o quita con renderizado condicional según el estado.
 */
function Navbar({ totalUnidades }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto((abierto) => !abierto)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  const hayProductos = totalUnidades > 0

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-gz sticky-top shadow-sm">
      <div className="container-fluid px-3 px-lg-4">
        <a className="navbar-brand fw-bold" href="#contenido-principal">
          🎮 GameZone
        </a>

        {/* onClick: alterna el estado del menú móvil */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={alternarMenu}
          aria-controls="navGameZone"
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Renderizado condicional de clases: "show" solo si menuAbierto es true */}
        <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="navGameZone">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#catalogo" onClick={cerrarMenu}>
                Catálogo
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#carrito" onClick={cerrarMenu}>
                Carrito
              </a>
            </li>
          </ul>

          <a href="#carrito" className="btn btn-warning position-relative" onClick={cerrarMenu}>
            🛒 Carrito
            {/* Estilo condicional: la insignia se destaca en rojo solo si hay productos */}
            <span
              className={`badge rounded-pill position-absolute top-0 start-100 translate-middle ${
                hayProductos ? 'bg-danger' : 'bg-secondary'
              }`}
              data-testid="contador-carrito"
            >
              {totalUnidades}
              <span className="visually-hidden"> productos en el carrito</span>
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
