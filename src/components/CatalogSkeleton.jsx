/**
 * CatalogSkeleton — "esqueleto" que se muestra mientras se cargan los productos.
 *
 * En vez de un simple spinner, reserva el espacio de las tarjetas con las
 * clases placeholder de Bootstrap. Así la página no "salta" cuando llegan
 * los datos y el usuario entiende qué contenido está por aparecer.
 */
const CANTIDAD_TARJETAS = 6

function CatalogSkeleton() {
  return (
    <div role="status" data-testid="cargando-catalogo">
      <div className="d-flex align-items-center gap-2 text-secondary mb-3">
        <div className="spinner-border spinner-border-sm" aria-hidden="true"></div>
        <span>Cargando catálogo desde data/productos.json...</span>
      </div>
      <div className="row g-3" aria-hidden="true">
        {Array.from({ length: CANTIDAD_TARJETAS }, (_, indice) => (
          <div className="col-12 col-sm-6 col-xl-4" key={indice}>
            <div className="card h-100 placeholder-glow">
              <div className="placeholder skeleton-imagen w-100"></div>
              <div className="card-body">
                <span className="placeholder col-4 mb-2"></span>
                <span className="placeholder col-8 d-block mb-2"></span>
                <span className="placeholder col-11 d-block mb-1"></span>
                <span className="placeholder col-9 d-block mb-3"></span>
                <span className="placeholder btn btn-warning disabled col-12"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CatalogSkeleton
