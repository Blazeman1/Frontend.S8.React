import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import ProductList from './components/ProductList.jsx'
import ShoppingCart from './components/ShoppingCart.jsx'
import Footer from './components/Footer.jsx'
import useProductos from './hooks/useProductos.js'
import useCarrito from './hooks/useCarrito.js'

const TITULO_BASE = 'GameZone | Funcionalidades clave en React - Semana 8'

/**
 * App — componente raíz de GameZone (Semana 8).
 *
 * App es el ancestro común de quien MODIFICA el carrito (ProductList, con el
 * botón "Agregar") y de quien lo MUESTRA (Navbar y ShoppingCart). Por eso el
 * estado compartido vive aquí ("lifting state up") y baja como props.
 *
 * Estados que maneja la aplicación:
 *   - Catálogo: productos, cargando, error      -> hook useProductos (useState + useEffect + fetch)
 *   - Carrito:  { id, cantidad }[]               -> hook useCarrito   (useState + useEffect + localStorage)
 *   - Última compra confirmada (este archivo)    -> useState, para el mensaje de éxito
 *   - Estados locales de interfaz (búsqueda, categoría, vista, menú, confirmación
 *     de vaciado) viven dentro del componente que los usa.
 */
function App() {
  const { productos, cargando, error, recargar, descontarStock } = useProductos()
  const { items, cantidades, resumen, agregar, disminuir, quitar, vaciar } = useCarrito(productos)

  // Guarda el resultado de la última compra para mostrar la confirmación.
  const [ultimaCompra, setUltimaCompra] = useState(null)

  // Efecto secundario simple: el título de la pestaña refleja el carrito.
  // Se vuelve a ejecutar solo cuando cambia la cantidad de unidades.
  useEffect(() => {
    document.title = resumen.unidades > 0 ? `(${resumen.unidades}) ${TITULO_BASE}` : TITULO_BASE
  }, [resumen.unidades])

  function handleAgregar(producto) {
    setUltimaCompra(null) // al empezar un nuevo carrito, se oculta la confirmación anterior
    agregar(producto)
  }

  /** Simula el cierre de compra: guarda el resumen, descuenta stock y vacía el carrito. */
  function handleFinalizarCompra() {
    if (items.length === 0) return
    setUltimaCompra({ unidades: resumen.unidades, total: resumen.total })
    descontarStock(items.map(({ id, cantidad }) => ({ id, cantidad })))
    vaciar()
  }

  return (
    <>
      <Navbar totalUnidades={resumen.unidades} />
      <main id="contenido-principal" className="container my-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <ProductList
              productos={productos}
              cargando={cargando}
              error={error}
              onReintentar={recargar}
              cantidadesEnCarrito={cantidades}
              onAddToCart={handleAgregar}
            />
          </div>
          <div className="col-12 col-lg-4">
            <ShoppingCart
              items={items}
              resumen={resumen}
              cargando={cargando}
              ultimaCompra={ultimaCompra}
              onIncrementar={handleAgregar}
              onDisminuir={disminuir}
              onQuitar={quitar}
              onVaciar={vaciar}
              onFinalizarCompra={handleFinalizarCompra}
              onCerrarConfirmacion={() => setUltimaCompra(null)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App
