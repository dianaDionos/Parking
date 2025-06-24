# SIFO - Sistema de Propiedad Horizontal

## Descripción del Proyecto

El módulo SIFO (Sistema de Propiedad Horizontal) está diseñado para facilitar la gestión de acceso en propiedades horizontales. Este sistema está orientado a guardias de seguridad, proporcionando una interfaz intuitiva y fácil de usar para el registro y control de residentes y visitantes.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- **public/**: Contiene archivos estáticos como el favicon de la aplicación.
- **src/**: Contiene el código fuente de la aplicación.
  - **components/**: Componentes reutilizables de la interfaz de usuario.
    - `ResidentTable.jsx`: Muestra una tabla con la información de los residentes.
    - `VisitorTable.jsx`: Muestra una tabla con la información de los visitantes.
    - `ParkingTable.jsx`: Muestra una tabla con los vehículos estacionados.
    - `SearchBar.jsx`: Proporciona funcionalidad de búsqueda para residentes y visitantes.
    - `VisitorModal.jsx`: Modal para agregar nuevos visitantes.
    - `Layout.jsx`: Componente de diseño que envuelve la estructura principal de la aplicación.
  - **pages/**: Contiene las páginas de la aplicación.
    - `_app.jsx`: Componente personalizado de Next.js para inicializar páginas.
    - `index.jsx`: Punto de entrada principal de la aplicación.
  - **styles/**: Contiene estilos globales.
    - `globals.css`: Estilos globales de la aplicación, incluyendo configuraciones de Tailwind CSS.
  - **utils/**: Funciones utilitarias para manipulación y formateo de datos.
    - `helpers.js`: Funciones de ayuda para residentes y visitantes.
- **tailwind.config.js**: Configuración de Tailwind CSS.
- **postcss.config.js**: Configuración de PostCSS.
- **package.json**: Configuración de npm, incluyendo dependencias y scripts.
- **next.config.js**: Configuración de Next.js.

## Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```
   cd sifo-acceso
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar la aplicación en modo de desarrollo, ejecuta:
```
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.