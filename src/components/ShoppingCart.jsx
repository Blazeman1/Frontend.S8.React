import { useState } from 'react'
import CartItem from './CartItem.jsx'
import CartTotal from './CartTotal.jsx'
import { formatearPrecio } from '../utils/precios.js'

/**
 * ShoppingCart — panel del carrito.
 *
 * No es dueño del carrito (vive en App / useCarrito): recibe los items ya
 * calculados y las funciones para modificarlos. Su trabajo es ORQUESTAR qué
 * se muestra según el estado (renderizado condicional):
 *
 *   - Catálogo cargando         -> aviso "Cargando carrito..."
 *   - Compra recién finalizada  -> mensaje de éxito
 *   - Carrito vacío             -> mensaje invitando a agregar productos
 *   - Carrito con productos     -> lista + total + botones de acción
 *
 * Tiene un único estado LOCAL: confirmandoVaciado, para pedir confirmación
 * antes de borrar todo (evita vaciar el carrito por un clic accidental).
 */
function ShoppingCart({
  items,
  resumen,
  cargando,
  ultimaCompra,
  onIncrementar,
  onDisminuir,
  onQuitar,
  onVaciar,
  onFinalizarCompra,
  onCerrarConfirmacion,
}) {
  const [confirmandoVaciado, setConfirmandoVaciado] = useState(false)
  const carritoVacio = items.length === 0

  function confirmarVaciado() {
    onVaciar()
    setConfirmandoVaciado(false)
  }

  function renderizarCuerpo() {
    if (cargando) {
      return (
        <p className="text-secondary mb-0 placeholder-glow">
          <span className="placeholder col-10"></span>
        </p>
      )
    }

    if (carritoVacio) {
      return (
        <>
          {/* Si se acaba de comprar, se muestra la confirmación en vez del mensaje genérico */}
          {ultimaCompra && (
            <div className="alert alert-success d-flex justify-content-between align-items-start gap-2" role="status" data-testid="compra-exitosa">
              <div>
                <strong>¡Compra realizada!</strong>
                <div className="small">
                  {ultimaCompra.unidades} {ultimaCompra.unidades === 1 ? 'unidad' : 'unidades'} por{' '}
                  {formatearPrecio(ultimaCompra.total)}. El stock del catálogo ya se actualizó.
                </div>
              </div>
              <button type="button" className="btn-close" aria-label="Cerrar mensaje" onClick={onCerrarConfirmacion}></button>
            </div>
          )}
          <p className="text-secondary mb-0" data-testid="carrito-vacio">
            Tu carrito está vacío. Agrega productos desde el catálogo.
          </p>
        </>
      )
    }

    return (
      <>
        <ul className="list-group list-group-flush mb-3">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrementar={onIncrementar}
              onDisminuir={onDisminuir}
              onQuitar={onQuitar}
            />
          ))}
        </ul>

        <CartTotal resumen={resumen} />

        <button type="button" className="btn btn-warning w-100 mt-3" onClick={onFinalizarCompra} data-testid="finalizar-compra">
          Finalizar compra
        </button>
      </>
    )
  }

  return (
    <aside id="carrito" className="carrito-panel sticky-lg-top" aria-labelledby="tituloCarrito">
      <div className="card carrito-card">
        <div className="card-header d-flex justify-content-between align-items-center gap-2">
          <h2 className="h5 mb-0" id="tituloCarrito">
            🛒 Mi carrito
            {/* Contador visible solo si hay productos */}
            {!carritoVacio && <span className="badge bg-warning text-dark ms-2">{resumen.unidades}</span>}
          </h2>

          {/* "Vaciar" solo aparece si hay algo que vaciar; y pide confirmación antes de actuar */}
          {!carritoVacio &&
            (confirmandoVaciado ? (
              <div className="d-flex gap-1 align-items-center">
                <span className="small">¿Vaciar?</span>
                <button type="button" className="btn btn-sm btn-danger" onClick={confirmarVaciado} data-testid="confirmar-vaciar">
                  Sí
                </button>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setConfirmandoVaciado(false)}>
                  No
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setConfirmandoVaciado(true)} data-testid="vaciar-carrito">
                Vaciar
              </button>
            ))}
        </div>
        <div className="card-body">{renderizarCuerpo()}</div>
      </div>
    </aside>
  )
}

export default ShoppingCart
