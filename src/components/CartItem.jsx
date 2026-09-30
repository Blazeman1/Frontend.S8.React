import { formatearPrecio, precioEfectivo } from '../utils/precios.js'

/**
 * CartItem — una fila del carrito.
 *
 * Presentacional: recibe el item ({ ...producto, cantidad }) y tres funciones.
 * Permite sumar (+), restar (−) o quitar (✕) el producto. El botón "+" se
 * deshabilita condicionalmente cuando ya se alcanzó el stock disponible.
 */
function CartItem({ item, onIncrementar, onDisminuir, onQuitar }) {
  const precioUnitario = precioEfectivo(item)
  const sinMasStock = item.cantidad >= item.stock

  return (
    <li className="list-group-item item-carrito px-0" data-testid={`item-carrito-${item.id}`}>
      <div className="flex-grow-1">
        <div className="nombre-item">{item.nombre}</div>
        <small className="text-secondary">
          {formatearPrecio(precioUnitario)} c/u · Subtotal {formatearPrecio(precioUnitario * item.cantidad)}
        </small>
        {sinMasStock && <div className="small text-warning">Máximo disponible</div>}
      </div>

      <div className="d-flex align-items-center gap-1">
        <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${item.nombre}`}>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onDisminuir(item.id)}
            aria-label={`Quitar una unidad de ${item.nombre}`}
            data-testid={`disminuir-${item.id}`}
          >
            −
          </button>
          <span className="btn btn-outline-secondary disabled cantidad-item" data-testid={`cantidad-${item.id}`}>
            {item.cantidad}
          </span>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onIncrementar(item)}
            disabled={sinMasStock}
            aria-label={`Agregar una unidad de ${item.nombre}`}
            data-testid={`incrementar-${item.id}`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onQuitar(item.id)}
          aria-label={`Quitar ${item.nombre} del carrito`}
          data-testid={`quitar-${item.id}`}
        >
          ✕
        </button>
      </div>
    </li>
  )
}

export default CartItem
