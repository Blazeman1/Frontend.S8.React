import { useMemo, useState } from 'react'
import CatalogToolbar from './CatalogToolbar.jsx'
import CatalogSkeleton from './CatalogSkeleton.jsx'
import ProductCard from './ProductCard.jsx'

/**
 * ProductList — sección de catálogo.
 *
 * Props (vienen de App):
 *   productos, cargando, error, onReintentar -> resultado de la carga con useEffect + fetch
 *   cantidadesEnCarrito, onAddToCart         -> conexión con el carrito
 *
 * Estados LOCALES (solo a este componente le interesan):
 *   busqueda  -> texto del buscador (input controlado con onChange)
 *   categoria -> filtro por categoría ("todas", "videojuegos", ...)
 *   vista     -> "grilla" o "lista": alterna entre dos presentaciones del catálogo
 */
function ProductList({ productos, cargando, error, onReintentar, cantidadesEnCarrito, onAddToCart }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [vista, setVista] = useState('grilla')

  // Las categorías se DERIVAN de los datos cargados (no se escriben a mano):
  // si mañana el JSON trae una categoría nueva, aparece sola en los filtros.
  const categorias = useMemo(
    () => ['todas', ...new Set(productos.map((producto) => producto.categoria))],
    [productos],
  )

  // useMemo: el filtrado solo se recalcula si cambian los productos, la
  // búsqueda o la categoría (no, por ejemplo, al alternar la vista).
  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return productos.filter(
      (producto) =>
        (categoria === 'todas' || producto.categoria === categoria) &&
        producto.nombre.toLowerCase().includes(texto),
    )
  }, [productos, busqueda, categoria])

  const hayFiltrosActivos = busqueda.trim() !== '' || categoria !== 'todas'

  function limpiarFiltros() {
    setBusqueda('')
    setCategoria('todas')
  }

  /**
   * Renderizado condicional con varios caminos posibles. Una función con
   * "early returns" es más legible que anidar operadores ternarios.
   */
  function renderizarContenido() {
    // 1) Mientras el useEffect de carga no termina: esqueleto de tarjetas.
    if (cargando) {
      return <CatalogSkeleton />
    }

    // 2) La carga falló: mensaje de error con opción de reintentar.
    if (error) {
      return (
        <div className="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center gap-3" role="alert">
          <div className="flex-grow-1">
            <strong>No pudimos cargar el catálogo.</strong>
            <div className="small">{error}</div>
          </div>
          <button type="button" className="btn btn-outline-light" onClick={onReintentar}>
            Reintentar
          </button>
        </div>
      )
    }

    // 3) Carga correcta pero ningún producto calza con los filtros.
    if (productosFiltrados.length === 0) {
      return (
        <div className="text-center text-secondary py-5 border rounded-3" data-testid="sin-resultados">
          <p className="mb-2">
            No se encontraron productos
            {busqueda.trim() !== '' && <> para &quot;{busqueda.trim()}&quot;</>}
            {categoria !== 'todas' && <> en la categoría {categoria}</>}.
          </p>
          <button type="button" className="btn btn-sm btn-outline-warning" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      )
    }

    // 4) Caso normal: la lista de productos en la vista elegida.
    return (
      <div className={`row g-3 ${vista === 'lista' ? 'catalogo-lista' : 'catalogo-grilla'}`} data-testid="catalogo">
        {productosFiltrados.map((producto) => (
          // key estable (id) para que React identifique cada tarjeta entre renders.
          <ProductCard
            key={producto.id}
            producto={producto}
            vista={vista}
            cantidadEnCarrito={cantidadesEnCarrito[producto.id] ?? 0}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    )
  }

  return (
    <section id="catalogo" aria-labelledby="tituloCatalogo" aria-busy={cargando}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h2 id="tituloCatalogo" className="mb-0">
          Catálogo de productos
        </h2>
        <span className="badge text-bg-secondary" data-testid="contador-catalogo">
          {cargando ? 'Cargando…' : error ? 'Sin datos' : `${productosFiltrados.length} de ${productos.length} productos`}
        </span>
      </div>

      <CatalogToolbar
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        categorias={categorias}
        categoria={categoria}
        onCategoriaChange={setCategoria}
        vista={vista}
        onVistaChange={setVista}
        deshabilitado={cargando || Boolean(error)}
      />

      {renderizarContenido()}
    </section>
  )
}

export default ProductList
