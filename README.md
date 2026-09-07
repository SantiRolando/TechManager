# 🛠️ TechManager

<div align="center">

**Sistema Integral de Gestión para Talleres y Servicios Técnicos**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net/)

</div>

---

## 📋 ¿Qué es TechManager y para qué sirve?

**TechManager** es una aplicación web full-stack diseñada específicamente para talleres, tiendas de informática y servicios técnicos de reparación. Su objetivo principal es **digitalizar y optimizar el flujo de trabajo operativo**, permitiendo administrar con precisión:

* **Gestión de Clientes:** Fichas completas de contacto y seguimiento de su historial.
* **Control de Dispositivos:** Registro detallado de equipos ingresados (marcas, modelos, contraseñas, números de serie).
* **Órdenes de Trabajo y Reparaciones:** Tablero de control de estados (*Ingresado*, *Pendiente de Presupuesto*, *En Revisión*, *Entregado*), diagnósticos técnicos y costos actualizados.
* **Comprobantes y Reportes Profesionales:** Generación de órdenes de reparación limpias y listas para imprimir o exportar a PDF en formato corporativo (con opción de ocultar datos sensibles como contraseñas o números de serie para mayor seguridad).

---

## 🚀 Tecnologías Utilizadas

### Frontend
* **React 18:** Biblioteca principal para el desarrollo de la interfaz de usuario basada en componentes.
* **React Router DOM:** Manejo de rutas y navegación dinámica entre vistas (*Single Page Application*).
* **Tailwind CSS:** Framework de estilos CSS utilitario enfocado en un diseño moderno, responsivo y con modo oscuro integrado.
* **Axios:** Cliente HTTP optimizado para la comunicación asíncrona con la API REST del backend.

### Backend
* **Laravel 10+ (PHP):** Framework backend robusto para estructurar la API REST y gestionar la lógica de negocio de manera segura.
* **Eloquent ORM:** Mapeo objeto-relacional para el manejo eficiente de bases de datos relacionales y la asociación limpia entre modelos (*Clientes*, *Dispositivos*, *Reparaciones*).
* **Laravel Sanctum / CORS:** Mecanismos de seguridad para gestionar peticiones seguras y control de accesos cruzados.

---

## 📂 Estructura del Proyecto y Funciones Principales

### 1. Frontend (`src/components/`)
* **`ClientDetail.jsx`**
  * **Función:** Muestra la ficha detallada de un cliente, sus datos de contacto (teléfono, email), la lista de dispositivos registrados a su nombre y el historial consolidado de todas sus reparaciones.
  * **Cómo funciona:** Realiza una petición asíncrona (`useEffect`) al endpoint del backend utilizando el identificador (`id`) de la URL, procesando y mapeando los dispositivos y reparaciones vinculados.
* **`RepairDetail.jsx`**
  * **Función:** Panel integral de gestión para una orden de trabajo individual. Permite actualizar en tiempo real el diagnóstico técnico, modificar el costo/presupuesto, cambiar el estado del equipo y generar un comprobante imprimible o exportable a PDF.
  * **Cómo funciona:** Utiliza estados locales para la edición dinámica y peticiones `PUT` al backend. Implementa estilos CSS nativos mediante `@media print` para ocultar elementos de navegación y datos sensibles (contraseñas y números de serie), generando un reporte corporativo limpio con el logo de la empresa.

### 2. Backend (`app/Http/Controllers/` y Modelos)
* **`ClientController.php` (Método `show`)**
  * **Función:** Endpoint encargado de proveer toda la información de un cliente junto a sus equipos y historiales de reparación asociados.
  * **Cómo funciona:** Utiliza la carga ansiosa anidada de Eloquent (`Client::with('devices.repairs')->findOrFail($id)`) para optimizar las consultas a la base de datos y serializar los datos en formato JSON.
* **`RepairController.php` (Métodos `show` y `update`)**
  * **Función:** Controla la consulta de los detalles de una orden específica y procesa las actualizaciones de sus campos clave (estado, notas de diagnóstico, costos).
  * **Cómo funciona:** Valida y persiste los cambios enviados desde la interfaz de usuario directamente en la base de datos a través del ORM.

---

## ⚙️ Guía de Instalación y Scripts de Ejecución

### Requisitos Previos
* Node.js y npm instalados en el sistema.
* PHP (versión 8.2 o superior) y Composer.
* Servidor de base de datos compatible (MySQL o SQLite).

---

### 1. Configuración del Backend (Laravel)

Abre una terminal y ejecuta los siguientes comandos para levantar la API:

```bash
# Entrar a la carpeta del servidor
cd backend

# Instalar dependencias de PHP
composer install

# Configurar el entorno (duplicar el archivo de ejemplo y generar la llave de seguridad)
cp .env.example .env
php artisan key:generate

# Configura las credenciales de tu base de datos en el archivo .env creado, luego ejecuta:
php artisan migrate

# Levantar el servidor de desarrollo de la API
php artisan serve
