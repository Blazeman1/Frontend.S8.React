import { useCallback, useEffect, useState } from 'react'

/**
 * useProductos — hook personalizado que CARGA el catálogo de GameZone.
 *
 * Mejora principal respecto de la Semana 7: allá los productos se importaban
 * de forma estática (import productos from './data/productos.js') y el
 * useEffect solo simulaba un spinner. Ahora el catálogo:
 *
 *   1. Vive en un ESTADO de React (useState) -> la lista puede cambiar en
 *      tiempo de ejecución (por ejemplo, se descuenta stock al comprar).
 *   2. Se obtiene con fetch() desde un archivo JSON externo al código
 *      (public/data/productos.json), igual que se haría con una API REST.
 *   3. Maneja los tres estados de toda petición: cargando, éxito y error.
 *
 * Extraer esta lógica a un hook propio ("use...") la vuelve reutilizable y
 * deja App.jsx enfocado en componer la interfaz.
 */

// Ruta relativa al sitio: BASE_URL vale './' en el build (por base: './' en
// vite.config.js), así la petición funciona dentro del subdirectorio de
// GitHub Pages (https://<usuario>.github.io/<repositorio>/data/productos.json).
const URL_PRODUCTOS = `${import.meta.env.BASE_URL}data/productos.json`

// Latencia artificial para SIMULAR una API remota: un JSON local responde en
// milisegundos y el estado de carga ni se alcanzaría a ver.
const LATENCIA_SIMULADA_MS = 800

/** Promesa que se resuelve tras `ms` milisegundos, cancelable con un AbortSignal. */
function esperar(ms, signal) {
  return new Promise((resolve, reject) => {
    const temporizador = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(temporizador)
        reject(new DOMException('Carga cancelada', 'AbortError'))
      },
      { once: true },
    )
  })
}

function useProductos() {
  // Estado del catálogo y de la petición.
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Contador de intentos: cambiarlo vuelve a disparar el efecto (botón "Reintentar").
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    // AbortController permite cancelar la petición si el componente se
    // desmonta (o si el efecto se vuelve a ejecutar) antes de que termine.
    const controlador = new AbortController()

    async function cargarProductos() {
      setCargando(true)
      setError(null)
      try {
        await esperar(LATENCIA_SIMULADA_MS, controlador.signal)

        const respuesta = await fetch(URL_PRODUCTOS, { signal: controlador.signal })
        // fetch NO lanza error ante un 404 o 500: hay que revisar respuesta.ok.
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió con el código ${respuesta.status}.`)
        }

        const datos = await respuesta.json()
        if (!Array.isArray(datos)) {
          throw new Error('El archivo de productos no tiene el formato esperado.')
        }

        // Actualizamos el estado con los datos recibidos -> React re-renderiza el catálogo.
        setProductos(datos)
      } catch (err) {
        // Una cancelación intencional no es un error que mostrar al usuario.
        if (err.name === 'AbortError') return
        setError(err.message || 'No se pudo cargar el catálogo.')
      } finally {
        if (!controlador.signal.aborted) setCargando(false)
      }
    }

    cargarProductos()

    // Función de limpieza: cancela la espera y el fetch pendientes.
    return () => controlador.abort()
  }, [intento]) // Se ejecuta al montar y cada vez que cambia "intento".

  /** Vuelve a pedir el catálogo (usado por el botón "Reintentar"). */
  const recargar = useCallback(() => setIntento((n) => n + 1), [])

  /**
   * Descuenta del stock las unidades compradas. Demuestra que la lista de
   * productos es ESTADO y no un dato fijo: al finalizar una compra, las
   * tarjetas del catálogo se actualizan solas ("Últimas unidades", "Agotado").
   * Recibe un arreglo de { id, cantidad }.
   */
  const descontarStock = useCallback((itemsComprados) => {
    setProductos((listaActual) =>
      listaActual.map((producto) => {
        const comprado = itemsComprados.find((item) => item.id === producto.id)
        return comprado ? { ...producto, stock: Math.max(0, producto.stock - comprado.cantidad) } : producto
      }),
    )
  }, [])

  return { productos, cargando, error, recargar, descontarStock }
}

export default useProductos
