import { formatearPrecio, porcentajeDescuento, tieneOferta } from '../utils/precios.js'

const UMBRAL_POCAS_UNIDADES = 3

/**
 * Decide cómo se ve el botón según el estado del producto. Concentrar esta
 * lógica en una función pura evita llenar el JSX de ternarios anidados.
 *
 *   Agotado               -> gris, deshabilitado, "Agotado"
 *   En carrito, sin stock -> verde, deshabilitado, "✓ En el carrito (n)" + aviso de máximo
 *   En carrito            -> verde, "✓ En el carrito (n)" (clic = sumar otra unidad)
 *   Disponible            -> amarillo, "Agregar al carrito"
 */
function obtenerEstadoBoton({ agotado, enCarrito, limiteAlcanzado, cantidadEnCarrito }) {
  if (agotado) {
    return { texto: 'Agotado', clase: 'btn-secondary', deshabilitado: true, ayuda: 'Sin stock disponible' }
  }
  if (limiteAlcanzado) {
    return {
      texto: `✓ En el carrito (${cantidadEnCarrito})`,
      clase: 'btn-success',
      deshabilitado: true,
      ayuda: 'Alcanzaste el máximo disponible',
    }
  }
  if (enCarrito) {
    return {
      texto: `✓ En el carrito (${cantidadEnCarrito})`,
      clase: 'btn-success',
      deshabilitado: false,
      ayuda: 'Haz clic para agregar otra unidad',
    }
  }
  return { texto: 'Agregar al carrito', clase: 'btn-warning', deshabilitado: false, ayuda: null }
}

/**
 * ProductCard — tarjeta de un producto.
 *
 * Componente presentacional: NO tiene estado propio. Todo lo que muestra se
 * deriva de sus props (producto, cantidadEnCarrito, vista). Por eso el texto
 * del botón cambia a "En el carrito" y se MANTIENE así mientras el producto
 * siga en el carrito (en la Semana 7 era solo un aviso de 1 segundo).
 */
function ProductCard({ producto, vista, cantidadEnCarrito, onAddToCart }) {
  const enOferta = tieneOferta(producto)
  const agotado = producto.stock <= 0
  const enCarrito = cantidadEnCarrito > 0
  const limiteAlcanzado = !agotado && cantidadEnCarrito >= producto.stock
  const pocasUnidades = !agotado && producto.stock <= UMBRAL_POCAS_UNIDADES
  const esLista = vista === 'lista'

  const boton = obtenerEstadoBoton({ agotado, enCarrito, limiteAlcanzado, cantidadEnCarrito })

  // Clases CSS condicionales según el estado del producto y la vista elegida.
  const clasesTarjeta = [
    'card',
    'producto-card',
    'h-100',
    esLista ? 'flex-sm-row' : '',
    enCarrito ? 'en-carrito' : '',
    agotado ? 'agotado' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={esLista ? 'col-12' : 'col-12 col-sm-6 col-xl-4'}>
      <article className={clasesTarjeta} data-testid={`producto-${producto.id}`}>
        <div className="position-relative producto-imagen">
          <img src={producto.imagen} alt={producto.nombre} loading="lazy" />

          {/* Insignias condicionales: cada una aparece solo si su condición es verdadera */}
          {enOferta && <span className="badge bg-danger badge-oferta">Oferta -{porcentajeDescuento(producto)}%</span>}
          {agotado && <span className="badge bg-dark badge-estado">Agotado</span>}
          {enCarrito && !agotado && <span className="badge bg-success badge-estado">En tu carrito</span>}
        </div>

        <div className="card-body d-flex flex-column">
          <span className="badge text-bg-secondary align-self-start mb-2">{producto.categoria}</span>
          <h3 className="h6 mb-1">{producto.nombre}</h3>
          <p className="text-secondary small mb-2">{producto.descripcion}</p>

          {/* Precio: con oferta muestra ambos (el normal tachado); sin oferta, solo el normal */}
          <div className="mb-1">
            {enOferta ? (
              <>
                <span className="precio-anterior me-2">{formatearPrecio(producto.precioNormal)}</span>
                <span className="precio-oferta">{formatearPrecio(producto.precioOferta)}</span>
              </>
            ) : (
              <span className="precio-normal">{formatearPrecio(producto.precioNormal)}</span>
            )}
          </div>

          {/* Mensaje de stock con tres variantes */}
          <p className="small mb-2" data-testid={`stock-${producto.id}`}>
            {agotado ? (
              <span className="text-danger">Sin stock por ahora</span>
            ) : pocasUnidades ? (
              <span className="text-warning">¡Últimas {producto.stock} unidades!</span>
            ) : (
              <span className="text-secondary">Stock disponible: {producto.stock}</span>
            )}
          </p>

          <button
            type="button"
            className={`btn ${boton.clase} mt-auto`}
            onClick={() => onAddToCart(producto)}
            disabled={boton.deshabilitado}
            title={boton.ayuda ?? undefined}
            data-testid={`agregar-${producto.id}`}
          >
            {boton.texto}
          </button>
          {/* Texto de ayuda bajo el botón: gris si aún se puede sumar, amarillo si se llegó al máximo */}
          {boton.ayuda && !agotado && (
            <small
              className={`text-center mt-1 ${limiteAlcanzado ? 'text-warning' : 'text-secondary'}`}
              data-testid={`ayuda-${producto.id}`}
            >
              {boton.ayuda}
            </small>
          )}
        </div>
      </article>
    </div>
  )
}

export default ProductCard
