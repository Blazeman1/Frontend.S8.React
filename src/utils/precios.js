/**
 * Utilidades de precios — funciones puras y reutilizables.
 *
 * En la Semana 7 la función formatearPrecio y la regla "¿tiene oferta?"
 * estaban copiadas en tres componentes distintos (ProductCard, CartItem y
 * CartTotal). Centralizarlas aquí elimina esa duplicación: si mañana cambia
 * la regla de ofertas o el formato de moneda, se corrige en UN solo lugar.
 */

const formateadorCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

/** Formatea un número como pesos chilenos. Ej: 27990 -> "$27.990". */
export function formatearPrecio(valor) {
  return formateadorCLP.format(valor)
}

/** Un producto está en oferta solo si tiene precioOferta Y este es menor al precio normal. */
export function tieneOferta(producto) {
  return producto.precioOferta != null && producto.precioOferta < producto.precioNormal
}

/** Precio que realmente se cobra: el de oferta si corresponde, si no el normal. */
export function precioEfectivo(producto) {
  return tieneOferta(producto) ? producto.precioOferta : producto.precioNormal
}

/** Porcentaje de descuento redondeado (0 si no hay oferta). Ej: 34990 -> 27990 = 20. */
export function porcentajeDescuento(producto) {
  if (!tieneOferta(producto)) return 0
  return Math.round((1 - producto.precioOferta / producto.precioNormal) * 100)
}
