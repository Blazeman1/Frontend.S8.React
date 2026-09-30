import { useCallback, useEffect, useMemo, useState } from 'react'
import { precioEfectivo } from '../utils/precios.js'

/**
 * useCarrito — hook personalizado con TODA la lógica del carrito de compras.
 *
 * Decisiones de diseño (mejoras respecto de la Semana 7):
 *
 * 1. Estado NORMALIZADO: el carrito solo guarda { id, cantidad }. Nombre,
 *    precio, imagen y stock se obtienen del catálogo (productos) al momento
 *    de mostrar. Así no hay dos copias del mismo producto que puedan quedar
 *    desincronizadas (por ejemplo, si cambia un precio o el stock).
 *
 * 2. Persistencia con useEffect + localStorage: el carrito sobrevive a una
 *    recarga de la página. Leer localStorage es un "efecto secundario"
 *    (interactúa con algo fuera de React), por eso se escribe dentro de un
 *    useEffect que se ejecuta cada vez que el carrito cambia.
 *
 * 3. Respeto del stock: no se puede agregar más unidades de las disponibles.
 *
 * 4. Valores derivados con useMemo (items, cantidades, resumen): se calculan a
 *    partir del estado en vez de guardarse en otro useState, y useMemo evita
 *    recalcularlos si ni el carrito ni el catálogo cambiaron.
 */

const CLAVE_ALMACENAMIENTO = 'gamezone-carrito-s8'

/**
 * Lee el carrito guardado. Se pasa a useState como FUNCIÓN (inicialización
 * perezosa): React la ejecuta solo en el primer renderizado, no en cada uno.
 * El try/catch protege ante navegadores con almacenamiento bloqueado o datos corruptos.
 */
function leerCarritoGuardado() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO)
    const datos = guardado ? JSON.parse(guardado) : []
    return Array.isArray(datos) ? datos.filter((item) => item && item.id != null && item.cantidad > 0) : []
  } catch {
    return []
  }
}

function useCarrito(productos) {
  // Estado del carrito: arreglo de { id, cantidad }.
  const [cart, setCart] = useState(leerCarritoGuardado)

  // Efecto: sincroniza el carrito con localStorage cada vez que cambia.
  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(cart))
    } catch {
      // Si el navegador bloquea el almacenamiento, el carrito sigue funcionando en memoria.
    }
  }, [cart])

  /** Agrega una unidad del producto, sin superar su stock. */
  const agregar = useCallback((producto) => {
    setCart((carritoActual) => {
      const existente = carritoActual.find((item) => item.id === producto.id)
      const cantidadActual = existente ? existente.cantidad : 0
      if (cantidadActual >= producto.stock) return carritoActual // sin stock suficiente: no cambia nada

      if (existente) {
        return carritoActual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      }
      return [...carritoActual, { id: producto.id, cantidad: 1 }]
    })
  }, [])

  /** Resta una unidad; si llega a 0, el producto sale del carrito. */
  const disminuir = useCallback((idProducto) => {
    setCart((carritoActual) =>
      carritoActual
        .map((item) => (item.id === idProducto ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => item.cantidad > 0),
    )
  }, [])

  /** Quita por completo un producto del carrito. */
  const quitar = useCallback((idProducto) => {
    setCart((carritoActual) => carritoActual.filter((item) => item.id !== idProducto))
  }, [])

  /** Vacía el carrito completo. */
  const vaciar = useCallback(() => setCart([]), [])

  // --- Valores derivados ---------------------------------------------------

  // Items "completos" para mostrar: datos del catálogo + cantidad del carrito.
  // Si el catálogo aún no carga, o un producto ya no existe / no tiene stock,
  // simplemente no se muestra. La cantidad nunca supera el stock disponible.
  const items = useMemo(
    () =>
      cart
        .map(({ id, cantidad }) => {
          const producto = productos.find((p) => p.id === id)
          if (!producto || producto.stock <= 0) return null
          return { ...producto, cantidad: Math.min(cantidad, producto.stock) }
        })
        .filter(Boolean),
    [cart, productos],
  )

  // Mapa { idProducto: cantidad } para que cada ProductCard sepa si ya está en el carrito.
  const cantidades = useMemo(() => Object.fromEntries(items.map((item) => [item.id, item.cantidad])), [items])

  // Resumen numérico del carrito: un único cálculo, reutilizado por Navbar,
  // CartTotal y el cierre de compra (sin duplicar la lógica en cada uno).
  const resumen = useMemo(() => {
    return items.reduce(
      (acumulado, item) => {
        const pagado = precioEfectivo(item) * item.cantidad
        const sinDescuento = item.precioNormal * item.cantidad
        return {
          unidades: acumulado.unidades + item.cantidad,
          subtotal: acumulado.subtotal + sinDescuento,
          ahorro: acumulado.ahorro + (sinDescuento - pagado),
          total: acumulado.total + pagado,
        }
      },
      { unidades: 0, subtotal: 0, ahorro: 0, total: 0 },
    )
  }, [items])

  return { items, cantidades, resumen, agregar, disminuir, quitar, vaciar }
}

export default useCarrito
