# 🎬 Cartelera Romántica - Invitación Especial

Una página web interactiva estilo cartelera de cine para invitar a una función especial de películas. Diseño cinematográfico oscuro con animaciones suaves, sistema de tickets con captcha romántico y mini-juego sorpresa.

## ✨ Características

- 🎭 **Diseño Cinematográfico**: Estética oscura inspirada en carteleras de cine
- 📱 **Responsive**: Mobile-first, optimizado para todos los dispositivos
- 🎟️ **Sistema de Tickets**: Tickets digitales con captcha romántico
- ⭐ **Mini-Juego**: Estrellas flotantes con mensajes románticos
- 🎨 **Animaciones Suaves**: Transiciones y efectos visuales elegantes
- 💾 **Persistencia**: LocalStorage para prevenir doble generación de tickets
- 🔊 **Sonidos Opcionales**: Efectos de sonido sutiles (muted por defecto)

## 📁 Estructura del Proyecto

```
/INVITACION
├── index.html              # HTML principal
├── styles/
│   ├── main.css           # Estilos principales
│   └── animations.css     # Animaciones CSS
├── scripts/
│   ├── app.js             # Lógica principal
│   └── utils.js           # Funciones helper
├── assets/
│   └── posters/
│       ├── dracula.webp   # Póster Drácula
│       └── pacificrim.webp # Póster Titanes
└── README.md              # Este archivo
```

## 🚀 Instalación y Uso Local

1. **Clonar o descargar el proyecto**
   ```bash
   cd INVITACION
   ```

2. **Abrir en navegador**
   - Simplemente abre `index.html` en tu navegador
   - O usa un servidor local:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     ```
   - Accede a `http://localhost:8000`

## 🌐 Deploy en Línea (Gratis)

### Opción 1: GitHub Pages (Recomendado)

1. **Crear repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Cartelera romántica"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/invitacion.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Selecciona branch `main` y carpeta `/ (root)`
   - Tu sitio estará en: `https://TU_USUARIO.github.io/invitacion`

### Opción 2: Netlify

1. **Crear cuenta en [Netlify](https://www.netlify.com/)**
2. **Arrastra y suelta** la carpeta del proyecto
3. **Listo** - Tu sitio estará en línea automáticamente

### Opción 3: Vercel

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

## ⚙️ Personalización

### 🔗 Reemplazar Link de Meet

**IMPORTANTE**: Antes de publicar, reemplaza el link placeholder de Google Meet.

1. Abre `scripts/app.js`
2. Busca las líneas con `meetLink: 'https://meet.google.com/xyz-1234-abc'`
3. Reemplaza con tu link real de Google Meet:
   ```javascript
   meetLink: 'https://meet.google.com/TU-LINK-REAL'
   ```

### 🎬 Cambiar Películas

En `scripts/app.js`, modifica el objeto `MOVIES`:

```javascript
const MOVIES = {
    dracula: {
        id: 'dracula',
        title: 'Drácula',
        year: '2025',
        meetLink: 'TU_LINK_MEET',
        songLink: 'TU_LINK_CANCION',
        question: '¿Tu pregunta personal?',
        answer: 'Respuesta correcta'
    },
    // ... más películas
};
```

### 💬 Cambiar Mensajes Románticos

En `scripts/app.js`, modifica el array `ROMANTIC_MESSAGES`:

```javascript
const ROMANTIC_MESSAGES = [
    'Tu mensaje 1',
    'Tu mensaje 2',
    // ...
];
```

### 🎨 Personalizar Colores

En `styles/main.css`, modifica las variables CSS:

```css
:root {
    --bg: #0b0b0d;           /* Fondo principal */
    --accent: #c62828;        /* Color de acento (rojo cine) */
    --gold: #d4a14a;          /* Color dorado */
    /* ... más variables */
}
```

### 🖼️ Agregar Pósters

1. Coloca tus imágenes en `assets/posters/`
2. Nómbralas: `dracula.webp` y `pacificrim.webp`
3. Optimiza las imágenes (recomendado: WebP, < 200KB cada una)

**Herramientas para optimizar:**
- [Squoosh](https://squoosh.app/) - Compresión online
- [TinyPNG](https://tinypng.com/) - Optimización de imágenes

## 📋 Checklist Antes de Publicar

- [ ] Reemplazar link de Meet con el real
- [ ] Verificar que los pósters estén optimizados
- [ ] Probar en diferentes dispositivos (móvil, tablet, desktop)
- [ ] Verificar que las respuestas del captcha funcionen
- [ ] Probar el flujo completo: splash → cartelera → captcha → ticket → juego
- [ ] Verificar que localStorage funcione correctamente
- [ ] Probar en modo incógnito para simular primera visita

## 🎯 Funcionalidades Técnicas

### Sistema de Tickets
- Validación de respuestas case-insensitive
- Prevención de doble generación con localStorage
- Animación tipo "impresión" al generar ticket
- Ticket con dos caras (flip animation)

### Accesibilidad
- Focus trap en modales
- Cierre con tecla ESC
- ARIA labels y roles
- Contraste adecuado para legibilidad

### Performance
- Lazy loading de imágenes
- Animaciones CSS optimizadas
- Vanilla JavaScript (sin frameworks pesados)
- Total < 500KB (con imágenes optimizadas)

## 🐛 Solución de Problemas

### Los pósters no se ven
- Verifica que las imágenes estén en `assets/posters/`
- Revisa la consola del navegador para errores 404
- Asegúrate de que los nombres coincidan exactamente

### El localStorage no funciona
- Algunos navegadores bloquean localStorage en modo incógnito
- Verifica que las cookies estén habilitadas
- Prueba en un navegador diferente

### Las animaciones no funcionan
- Verifica que `animations.css` esté cargado
- Revisa la consola para errores JavaScript
- Asegúrate de usar un navegador moderno

## 📝 Notas

- Los sonidos están muted por defecto (se pueden activar con el botón 🔊)
- El diseño es mobile-first, se adapta automáticamente a pantallas grandes
- Los tickets se guardan en localStorage del navegador
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)

## 💝 Créditos

Hecho con ❤️ para una función especial.

---

**¿Necesitas ayuda?** Revisa la consola del navegador (F12) para ver errores o mensajes de depuración.

