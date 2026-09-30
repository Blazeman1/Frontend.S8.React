/**
 * CatalogToolbar — buscador, filtro por categoría y selector de vista.
 *
 * Componente PRESENTACIONAL y totalmente "controlado": no tiene estado
 * propio. Muestra los valores que recibe por props (busqueda, categoria,
 * vista) y avisa cada cambio al padre (ProductList) mediante funciones.
 * Así el padre sigue siendo la única fuente de verdad de los filtros.
 */

const ETIQUETAS_CATEGORIA = {
  todas: 'Todas',
  videojuegos: 'Videojuegos',
  consolas: 'Consolas',
  accesorios: 'Accesorios',
}

const VISTAS = [
  { valor: 'grilla', etiqueta: '▦ Cuadrícula' },
  { valor: 'lista', etiqueta: '☰ Lista' },
]

function CatalogToolbar({
  busqueda,
  onBusquedaChange,
  categorias,
  categoria,
  onCategoriaChange,
  vista,
  onVistaChange,
  deshabilitado,
}) {
  return (
    <div className="d-flex flex-column gap-2 mb-3">
      <label htmlFor="inputBusqueda" className="visually-hidden">
        Buscar productos
      </label>
      {/* Input controlado: su valor viene del estado y onChange lo actualiza en cada tecla */}
      <input
        id="inputBusqueda"
        type="search"
        className="form-control"
        placeholder="Buscar productos por nombre..."
        value={busqueda}
        onChange={(evento) => onBusquedaChange(evento.target.value)}
        disabled={deshabilitado}
      />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex flex-wrap gap-1" role="group" aria-label="Filtrar por categoría">
          {categorias.map((valor) => (
            <button
              key={valor}
              type="button"
              // Estilo condicional: el filtro activo se pinta relleno, el resto con borde.
              className={`btn btn-sm ${categoria === valor ? 'btn-warning' : 'btn-outline-secondary'}`}
              aria-pressed={categoria === valor}
              onClick={() => onCategoriaChange(valor)}
              disabled={deshabilitado}
              data-testid={`categoria-${valor}`}
            >
              {ETIQUETAS_CATEGORIA[valor] ?? valor}
            </button>
          ))}
        </div>

        <div className="btn-group btn-group-sm" role="group" aria-label="Cambiar vista del catálogo">
          {VISTAS.map(({ valor, etiqueta }) => (
            <button
              key={valor}
              type="button"
              className={`btn ${vista === valor ? 'btn-light' : 'btn-outline-light'}`}
              aria-pressed={vista === valor}
              onClick={() => onVistaChange(valor)}
              disabled={deshabilitado}
              data-testid={`vista-${valor}`}
            >
              {etiqueta}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CatalogToolbar
