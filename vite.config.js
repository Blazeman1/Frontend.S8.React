import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para GameZone (Semana 8 - PFY2201).
//
// base: './' genera rutas RELATIVAS para todos los assets del build (JS, CSS,
// imágenes). GitHub Pages publica el sitio en un subdirectorio
// (https://<usuario>.github.io/<repositorio>/), no en la raíz del dominio, así
// que una base absoluta ("/") rompería la carga de archivos. Con base relativa
// el proyecto funciona sin importar el nombre del repositorio.
//
// Esta misma base relativa es la que usa el hook useProductos para pedir el
// archivo data/productos.json con fetch() (ver src/hooks/useProductos.js).
export default defineConfig({
  plugins: [react()],
  base: './',
})
