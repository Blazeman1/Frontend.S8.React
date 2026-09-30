import { formatearPrecio } from '../utils/precios.js'

/**
 * CartTotal — resumen de montos del carrito.
 *
 * Ya no calcula nada: recibe el resumen calculado UNA vez en useCarrito
 * (unidades, subtotal, ahorro, total). La línea de "Ahorro por ofertas"
 * solo se muestra si efectivamente hay descuento (renderizado condicional).
 */
function CartTotal({ resumen }) {
  const hayAhorro = resumen.ahorro > 0

  return (
    <div className="border-top pt-3" data-testid="resumen-carrito">
      {hayAhorro && (
        <>
          <div className="d-flex justify-content-between small text-secondary">
            <span>Subtotal ({resumen.unidades} unid.)</span>
            <span>{formatearPrecio(resumen.subtotal)}</span>
          </div>
          <div className="d-flex justify-content-between small text-success mb-1" data-testid="ahorro">
            <span>Ahorro por ofertas</span>
            <span>−{formatearPrecio(resumen.ahorro)}</span>
          </div>
        </>
      )}
      <div className="d-flex justify-content-between fw-bold fs-5">
        <span>Total</span>
        <span data-testid="total-carrito">{formatearPrecio(resumen.total)}</span>
      </div>
    </div>
  )
}

export default CartTotal
