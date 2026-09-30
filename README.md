# GameZone — Semana 8 (PFY2201) · Evaluación sumativa

**Mejorando funcionalidades clave en el eCommerce con React.** Continúa el proyecto GameZone de la Semana 7 (React 18 + Vite) y mejora el ciclo catálogo–carrito con `useState`, `useEffect` y renderizado condicional.

- Repositorio: https://github.com/Blazeman1/Frontend.S8.React
- Sitio publicado: https://blazeman1.github.io/Frontend.S8.React/

## Qué se mejoró respecto de la Semana 7

| Aspecto | Semana 7 | Semana 8 |
|---|---|---|
| Origen de los productos | `import` estático de `productos.js` | `fetch()` de `public/data/productos.json` dentro de `useEffect`, con estados de carga, éxito y error |
| Lista de productos | Dato fijo | Estado (`useState`): el stock se descuenta al finalizar una compra |
| Botón del producto | "✓ Agregado" por 1 segundo | "✓ En el carrito (n)" mientras siga en el carrito; "Agotado" o bloqueado al llegar al stock |
| Carrito | Agregar, quitar, vaciar | + / −, límite por stock, ahorro por ofertas, confirmación al vaciar, "Finalizar compra", persistencia en `localStorage` |
| Vistas | Solo cuadrícula | Filtro por categoría y alternancia Cuadrícula / Lista |
| Buenas prácticas | Formato de precio repetido en 3 componentes | `src/utils/precios.js` + hooks propios en `src/hooks/`; Bootstrap instalado con npm |

## Requisitos

- Node.js 18 o superior y npm

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El catálogo tarda ~1 segundo en aparecer a propósito: `useProductos` simula la latencia de una API antes de leer el JSON.

## Publicar en GitHub Pages (rama `gh-pages`)

```bash
npm run deploy
```

`predeploy` compila el proyecto (`npm run build`) y luego el paquete `gh-pages` publica la carpeta `dist/` en la rama `gh-pages`. En GitHub → *Settings → Pages*, la fuente debe ser la rama `gh-pages`, carpeta `/ (root)`.

`vite.config.js` usa `base: './'`, así que los assets y el `fetch` de `data/productos.json` funcionan dentro del subdirectorio del repositorio sin importar su nombre.

## Subir el proyecto por primera vez

```bash
git init
git add .
git commit -m "Semana 8: funcionalidades clave con useState, useEffect y renderizado condicional"
git branch -M main
git remote add origin https://github.com/Blazeman1/Frontend.S8.React.git
git push -u origin main
npm run deploy
```

`node_modules/` y `dist/` están en `.gitignore`; `npm install` y `npm run build` los regeneran.

## Estructura

```
├── index.html
├── package.json               # scripts dev, build, preview, predeploy, deploy
├── vite.config.js             # base: './' para GitHub Pages
├── public/
│   ├── data/productos.json    # fuente de datos consumida con fetch
│   └── img/                   # imágenes de productos
├── src/
│   ├── main.jsx               # punto de entrada; importa Bootstrap y estilos
│   ├── App.jsx                # compone la app y conecta catálogo y carrito
│   ├── hooks/
│   │   ├── useProductos.js    # useState + useEffect + fetch (carga, error, reintentar)
│   │   └── useCarrito.js      # useState + useEffect (localStorage) + useMemo
│   ├── components/
│   │   ├── Navbar.jsx         # menú móvil con useState, contador del carrito
│   │   ├── ProductList.jsx    # búsqueda, categoría, vista; renderizado condicional
│   │   ├── CatalogToolbar.jsx # controles del catálogo (componente controlado)
│   │   ├── CatalogSkeleton.jsx# esqueleto mientras carga
│   │   ├── ProductCard.jsx    # botón "Agregar" / "En el carrito" / "Agotado"
│   │   ├── ShoppingCart.jsx   # vacío, con productos, confirmación, compra exitosa
│   │   ├── CartItem.jsx       # + / − / quitar
│   │   ├── CartTotal.jsx      # subtotal, ahorro, total
│   │   └── Footer.jsx
│   ├── utils/precios.js       # formato CLP y reglas de oferta (sin duplicación)
│   └── styles/app.css
└── docs/
    └── FernandoFuentes_PFY2201_EXP3_S8.docx   # capturas y mapeo a la pauta
```

## Autor

Fernando Fuentes Allende — Desarrollo Frontend I (PFY2201) — Duoc UC
