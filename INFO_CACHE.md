# 💾 Información sobre el Almacenamiento (Cache)

## ¿Cómo se guardan los tickets?

Los tickets se guardan en **localStorage** del navegador, que es una forma de almacenamiento local persistente.

### ✅ Ventajas:
- **Persistente**: Los datos se mantienen incluso después de cerrar el navegador
- **Rápido**: Acceso inmediato sin necesidad de servidor
- **Privado**: Solo se guarda en el navegador de la persona
- **Sin expiración**: Los datos permanecen hasta que se eliminen manualmente

### 📍 Dónde se guarda:
- En el navegador de la persona que obtiene los tickets
- Específicamente en el **localStorage** del navegador
- Cada navegador tiene su propio almacenamiento (Chrome, Firefox, Safari, etc.)

### 🔍 Cómo verificar:
1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Application** (Chrome) o **Storage** (Firefox)
3. Busca **Local Storage** en el menú lateral
4. Verás las claves: `ticket_dracula` y `ticket_pacificrim`

### ⚠️ Cuándo se pierden los datos:
- Si la persona **limpia el cache** del navegador
- Si usa **modo incógnito** y cierra todas las ventanas
- Si **elimina manualmente** los datos del sitio
- Si cambia de navegador o dispositivo

### 💡 Recomendación:
Si quieres que los tickets persistan incluso después de limpiar el cache, podrías:
- Agregar un botón para "Exportar tickets" (descargar como JSON)
- O implementar un sistema de respaldo en la nube (más complejo)

### 🔐 Privacidad:
- Los datos **NO se envían a ningún servidor**
- Todo queda **local en el navegador**
- Es completamente **privado y seguro**

---

**Nota**: Si la persona limpia el cache del navegador, los tickets se perderán. Es parte del diseño para mantener la privacidad local.

