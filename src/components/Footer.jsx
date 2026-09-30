/** Footer — pie de página con información de contacto y redes sociales. */
function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h3 className="h6 text-uppercase">GameZone</h3>
            <p className="text-secondary mb-0">
              Tu tienda de videojuegos, consolas y accesorios. Proyecto académico Duoc UC - PFY2201.
            </p>
          </div>
          <div className="col-md-4">
            <h3 className="h6 text-uppercase">Contacto</h3>
            <ul className="list-unstyled text-secondary mb-0">
              <li>📧 contacto@gamezone.cl</li>
              <li>📞 +56 9 1234 5678</li>
              <li>📍 Santiago, Chile</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h3 className="h6 text-uppercase">Síguenos</h3>
            <a href="#" className="text-light me-3 fs-5" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="text-light me-3 fs-5" aria-label="Twitter/X">
              🐦
            </a>
            <a href="#" className="text-light fs-5" aria-label="YouTube">
              ▶️
            </a>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center text-secondary small mb-0">
          &copy; 2026 GameZone — Fernando Fuentes Allende · PFY2201 · Funcionalidades clave en React (Semana 8)
        </p>
      </div>
    </footer>
  )
}

export default Footer
