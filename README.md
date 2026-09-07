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

### Backend y Entorno
* **Laravel 10+ (PHP):** Framework backend robusto para estructurar la API REST y gestionar la lógica de negocio de manera segura.
* **Eloquent ORM:** Mapeo objeto-relacional para el manejo eficiente de bases de datos relacionales y la asociación limpia entre modelos (*Clientes*, *Dispositivos*, *Reparaciones*).
* **XAMPP (MySQL / Apache):** Entorno local para el servicio de base de datos relacional y gestión de puertos locales.

---

## 📂 Estructura del Proyecto y Funciones Principales

### 1. Frontend (`src/components/`)
* **`ClienteFrom.jsx`**
  * **Función:** Formulario interactivo para el registro y alta de nuevos clientes en el sistema, validando los datos de entrada antes de enviarlos al backend.
* **`ClienteDetail.jsx`**
  * **Función:** Muestra la ficha detallada de un cliente, sus datos de contacto (teléfono, email), la lista de dispositivos registrados a su nombre y el historial consolidado de todas sus reparaciones.
  * **Cómo funciona:** Realiza una petición asíncrona (`useEffect`) al endpoint del backend utilizando el identificador (`id`) de la URL, procesando y mapeando los dispositivos y reparaciones vinculados.
* **`RepairForm.jsx`**
  * **Función:** Interfaz de creación de nuevas órdenes de trabajo o reparaciones, asociando al cliente y al dispositivo ingresado con su respectivo problema inicial y notas.
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

## ⚙️ Automatización y Control del Servidor (Scripts)

El proyecto incluye scripts en la raíz para simplificar la inicialización y el apagado seguro de todo el entorno de desarrollo (XAMPP, Backend Laravel y Frontend React).

### 1. Script de Inicio (`start-techmanager.sh`)
* **¿Qué hace y cómo funciona?** 
  Verifica los permisos de superusuario, detiene de forma automática cualquier servicio del sistema que pueda entrar en conflicto (como Apache o MySQL nativos), comprueba la disponibilidad de los puertos necesarios, inicia los servicios de XAMPP y levanta en segundo plano tanto la API de Laravel (en el puerto `8000`) como el servidor de desarrollo de Vite (en el puerto `5173`), guardando sus registros de actividad y identificadores de proceso.
* **Cómo se ejecuta:**
  ```bash
  ./start-techmanager.sh

### 2. Script de Apagado (stop-techmanager.sh)
* **¿Qué hace y cómo funciona?** 
Lee los archivos de control de procesos generados al iniciar, detiene limpiamente las instancias en ejecución de Laravel y React/Vite de forma segura y procede a detener por completo los servicios de XAMPP.

**Cómo se ejecuta:**

bash
./stop-techmanager.sh


### Uso del Sistema
Ejecuta el script de inicio (./start-techmanager.sh) para encender todo el entorno de desarrollo automáticamente.

Ingresa a la interfaz web desde tu navegador en http://127.0.0.1:5173.

Navega por el sistema para gestionar clientes, registrar equipos o actualizar órdenes de reparación.

Al finalizar la jornada de trabajo, ejecuta el script de apagado (./stop-techmanager.sh) para detener todos los servicios de forma ordenada.







dasdasd
