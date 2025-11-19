// Utilidades y funciones helper

/**
 * Normaliza una respuesta eliminando espacios y convirtiendo a minúsculas
 * @param {string} answer - Respuesta a normalizar
 * @returns {string} Respuesta normalizada
 */
function normalizeAnswer(answer) {
    return answer.trim().toLowerCase();
}

/**
 * Valida si una respuesta es correcta (case-insensitive)
 * @param {string} userAnswer - Respuesta del usuario
 * @param {string} correctAnswer - Respuesta correcta
 * @returns {boolean} true si es correcta
 */
function validateAnswer(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    return normalizedUser === normalizedCorrect;
}

/**
 * Guarda el estado de un ticket en localStorage
 * @param {string} movieId - ID de la película
 * @param {object} ticketData - Datos del ticket
 */
function saveTicketToStorage(movieId, ticketData) {
    try {
        const key = `ticket_${movieId}`;
        const data = {
            obtained: true,
            timestamp: Date.now(),
            ...ticketData
        };
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn('No se pudo guardar en localStorage:', error);
    }
}

/**
 * Verifica si un ticket ya fue obtenido
 * @param {string} movieId - ID de la película
 * @returns {boolean} true si ya fue obtenido
 */
function isTicketObtained(movieId) {
    try {
        const key = `ticket_${movieId}`;
        const data = localStorage.getItem(key);
        if (!data) return false;
        const parsed = JSON.parse(data);
        return parsed.obtained === true;
    } catch (error) {
        console.warn('Error al leer localStorage:', error);
        return false;
    }
}

/**
 * Obtiene datos de un ticket guardado
 * @param {string} movieId - ID de la película
 * @returns {object|null} Datos del ticket o null
 */
function getTicketData(movieId) {
    try {
        const key = `ticket_${movieId}`;
        const data = localStorage.getItem(key);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.warn('Error al leer ticket:', error);
        return null;
    }
}

/**
 * Crea un elemento DOM con atributos
 * @param {string} tag - Etiqueta HTML
 * @param {object} attributes - Atributos del elemento
 * @param {string} textContent - Contenido de texto
 * @returns {HTMLElement} Elemento creado
 */
function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

/**
 * Maneja el focus trap en un modal
 * @param {HTMLElement} modal - Elemento modal
 * @param {HTMLElement} firstFocusable - Primer elemento enfocable
 * @param {HTMLElement} lastFocusable - Último elemento enfocable
 */
function setupFocusTrap(modal, firstFocusable, lastFocusable) {
    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    };

    modal.addEventListener('keydown', handleTabKey);
}

/**
 * Reproduce un sonido (opcional, muted por defecto)
 * @param {string} type - Tipo de sonido ('ticket', 'success', etc.)
 */
function playSound(type = 'ticket') {
    // Por ahora solo simulamos el sonido
    // En una versión futura se puede agregar Web Audio API con samples pequeños
    const muted = localStorage.getItem('sounds_muted') === 'true';
    if (muted) return;

    // Crear un sonido simple con Web Audio API (muy ligero)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = type === 'ticket' ? 440 : 523.25;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        // Silenciar errores de audio
    }
}

/**
 * Scroll suave a un elemento
 * @param {HTMLElement} element - Elemento destino
 */
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

/**
 * Debounce para funciones
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle para funciones
 * @param {Function} func - Función a throttle
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función con throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Verifica si el dispositivo es móvil
 * @returns {boolean} true si es móvil
 */
function isMobile() {
    return window.innerWidth <= 599;
}

/**
 * Formatea una fecha
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

// Exportar funciones para uso global
window.utils = {
    normalizeAnswer,
    validateAnswer,
    saveTicketToStorage,
    isTicketObtained,
    getTicketData,
    createElement,
    setupFocusTrap,
    playSound,
    smoothScrollTo,
    debounce,
    throttle,
    isMobile,
    formatDate
};

