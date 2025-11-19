// Aplicación principal - Cartelera Romántica

// Configuración de películas
const MOVIES = {
    dracula: {
        id: 'dracula',
        title: 'Drácula',
        year: '2025',
        meetLink: 'https://discord.gg/aB5YBMgB', // REEMPLAZAR CON LINK REAL
        specialLink: {
            type: 'song', // 'song', 'tiktok', 'message', 'photo', 'video'
            url: 'https://youtu.be/rigubwkGxdw', // REEMPLAZAR CON CANCIÓN REAL
            label: '🎵 Canción especial',
            highlight: true // Esta es la que resalta
        },
        question: '¿Cuál es mi jugador favorito?',
        answer: 'Raphinha'
    },
    pacificrim: {
        id: 'pacificrim',
        title: 'Titanes del Pacífico',
        year: '2013',
        meetLink: 'https://discord.gg/aB5YBMgB', // REEMPLAZAR CON LINK REAL
        specialLink: {
            type: 'tiktok', // 'song', 'tiktok', 'message', 'photo', 'video'
            url: 'https://vm.tiktok.com/ZMA36bNQf/', // REEMPLAZAR CON TIKTOK REAL
            label: '📱 TikTok especial',
            highlight: false
        },
        question: '¿Cuál es mi equipo favorito?',
        answer: 'Barcelona'
    }
};

// Mensaje progresivo para las estrellas (constelación)
const CONSTELLATION_MESSAGE = [
    'Me encanta…',
    '…cómo sonríes…',
    '…y cómo haces que…',
    '…mis días…',
    '…se sientan más bonitos.'
];

// Canción sorpresa final
const SURPRISE_SONG = 'https://youtu.be/dQw4w9WgXcQ'; // REEMPLAZAR CON CANCIÓN REAL

// Estado del juego de estrellas
let revealedStars = new Set();

// Estado de la aplicación
let currentMovie = null;
let muted = localStorage.getItem('sounds_muted') === 'true';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que utils esté disponible
    if (typeof utils === 'undefined') {
        console.error('Error: utils.js no se cargó correctamente. Verifica que el script esté antes de app.js');
    }
    initializeApp();
});

function initializeApp() {
    // Configurar botón de entrada
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', handleEnter);
    }

    // Configurar botones de ticket
    const ticketButtons = document.querySelectorAll('.btn-ticket');
    ticketButtons.forEach(btn => {
        btn.addEventListener('click', handleTicketClick);
        // Verificar si el ticket ya fue obtenido
        const movieId = btn.dataset.movie;
        let isObtained = false;
        
        if (typeof utils !== 'undefined' && utils.isTicketObtained) {
            isObtained = utils.isTicketObtained(movieId);
        } else {
            try {
                const data = localStorage.getItem(`ticket_${movieId}`);
                if (data) {
                    const parsed = JSON.parse(data);
                    isObtained = parsed.obtained === true;
                }
            } catch (e) {
                // Ignorar errores
            }
        }
        
        if (isObtained) {
            btn.disabled = true;
            btn.textContent = 'Ticket ya obtenido 💌';
        }
    });

    // Configurar modal de captcha
    setupCaptchaModal();

    // Configurar ticket
    setupTicket();

    // Configurar mini-juego de estrellas
    setupStarsGame();

    // Configurar botón de sorpresa
    const surpriseBtn = document.getElementById('surprise-btn');
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', showStarsGame);
    }

    // Configurar navbar y navegación
    setupNavigation();

    // Configurar sección Mis Tickets
    setupMyTicketsSection();

    // Configurar botón de mute
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
        updateMuteButton(muteBtn);
    }

    // Cargar tickets guardados al iniciar
    loadSavedTickets();
    updateTicketsBadge();

    // Mostrar splash screen inicialmente
    showSplashScreen();
}

// Pantalla de introducción
function showSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.classList.add('active');
    }
}

function handleEnter() {
    const splash = document.getElementById('splash-screen');
    const main = document.getElementById('main-content');
    const navbar = document.getElementById('navbar');

    if (splash && main) {
        splash.classList.remove('active');
        setTimeout(() => {
            splash.style.display = 'none';
            main.classList.add('active');
            // Mostrar navbar después de salir del splash
            if (navbar) {
                navbar.classList.add('visible');
            }
        }, 800);
    }
}

// Manejo de tickets
function handleTicketClick(e) {
    const button = e.currentTarget;
    const movieId = button.dataset.movie;
    const movie = MOVIES[movieId];

    if (!movie) {
        console.error('Error: película no encontrada para', movieId);
        return;
    }

    // Verificar si ya tiene ticket
    let isObtained = false;
    if (typeof utils !== 'undefined' && utils.isTicketObtained) {
        isObtained = utils.isTicketObtained(movieId);
    } else {
        try {
            const data = localStorage.getItem(`ticket_${movieId}`);
            if (data) {
                const parsed = JSON.parse(data);
                isObtained = parsed.obtained === true;
            }
        } catch (e) {
            console.error('Error verificando ticket:', e);
        }
    }

    if (isObtained) {
        showMessage('Ya tienes tu ticket para esta función 💌', 'info');
        return;
    }

    currentMovie = movie;
    showCaptchaModal(movie);
}

// Modal de captcha
function setupCaptchaModal() {
    const modal = document.getElementById('captcha-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const cancelBtn = modal?.querySelector('.btn-cancel');
    const confirmBtn = document.getElementById('confirm-btn');
    const input = document.getElementById('captcha-answer');

    // Cerrar modal
    [closeBtn, cancelBtn, modal?.querySelector('.modal-backdrop')].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeCaptchaModal);
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeCaptchaModal();
        }
    });

    // Confirmar respuesta
    if (confirmBtn) {
        confirmBtn.addEventListener('click', validateCaptcha);
    }

    // Enter en input
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                validateCaptcha();
            }
        });
    }
}

function showCaptchaModal(movie) {
    const modal = document.getElementById('captcha-modal');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('captcha-answer');
    const messageEl = document.getElementById('captcha-message');

    if (!modal || !questionText || !answerInput) return;

    questionText.textContent = movie.question;
    answerInput.value = '';
    messageEl.textContent = '';
    messageEl.className = 'captcha-message';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    answerInput.focus();

    // Focus trap
    const firstFocusable = answerInput;
    const lastFocusable = modal.querySelector('.btn-cancel');
    if (firstFocusable && lastFocusable) {
        utils.setupFocusTrap(modal, firstFocusable, lastFocusable);
    }
}

function closeCaptchaModal() {
    const modal = document.getElementById('captcha-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        currentMovie = null;
    }
}

function validateCaptcha() {
    const input = document.getElementById('captcha-answer');
    const messageEl = document.getElementById('captcha-message');

    if (!input || !messageEl || !currentMovie) {
        console.error('Error: elementos no encontrados o currentMovie no definido');
        return;
    }

    // Guardar referencia de la película antes de que se limpie
    const movie = currentMovie;
    const userAnswer = input.value;
    const correctAnswer = movie.answer;

    // Verificar que utils esté disponible
    if (typeof utils === 'undefined' || !utils.validateAnswer) {
        console.error('Error: utils no está disponible');
        messageEl.textContent = 'Error: por favor recarga la página';
        messageEl.className = 'captcha-message error';
        return;
    }

    if (utils.validateAnswer(userAnswer, correctAnswer)) {
        // Respuesta correcta
        messageEl.textContent = '¡Ticket obtenido! 🎟️';
        messageEl.className = 'captcha-message success';
        
        setTimeout(() => {
            closeCaptchaModal();
            // Generar ticket y agregarlo a Mis Tickets usando la referencia guardada
            generateTicket(movie);
            addTicketToMyTickets(movie);
        }, 1500);
    } else {
        // Respuesta incorrecta
        messageEl.textContent = 'Casi… inténtalo otra vez 🥺';
        messageEl.className = 'captcha-message error';
        input.value = '';
        input.focus();
    }
}

// Sistema de tickets
function setupTicket() {
    const flipBtn = document.getElementById('flip-ticket-btn');
    const flipBackBtn = document.getElementById('flip-back-btn');
    const closeBtn = document.getElementById('close-ticket-btn');
    const ticket = document.getElementById('ticket');

    if (flipBtn) {
        flipBtn.addEventListener('click', () => flipTicket(true));
    }

    if (flipBackBtn) {
        flipBackBtn.addEventListener('click', () => flipTicket(false));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeTicket);
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const container = document.getElementById('ticket-container');
            if (container?.classList.contains('active')) {
                closeTicket();
            }
        }
    });
}

function generateTicket(movie) {
    // Validar que movie no sea null
    if (!movie) {
        console.error('Error: movie es null o undefined en generateTicket');
        return;
    }

    const container = document.getElementById('ticket-container');
    const ticket = document.getElementById('ticket');
    const titleEl = document.getElementById('ticket-movie-title');
    const meetLinkEl = document.getElementById('ticket-meet-link');
    const songLinkEl = document.getElementById('ticket-song-link');

    if (!container || !ticket || !titleEl) {
        console.error('Error: elementos del ticket no encontrados');
        return;
    }

    // Llenar datos del ticket
    titleEl.textContent = movie.title;
    if (meetLinkEl) {
        meetLinkEl.href = movie.meetLink;
    }
    if (songLinkEl && movie.specialLink) {
        songLinkEl.href = movie.specialLink.url;
        songLinkEl.textContent = movie.specialLink.label;
        // Destacar la canción si es highlight
        if (movie.specialLink.highlight) {
            songLinkEl.classList.add('highlight-link');
        } else {
            songLinkEl.classList.remove('highlight-link');
        }
    }

    // Resetear estado del ticket
    ticket.classList.remove('flipped');
    ticket.classList.add('print-animation');

    // Mostrar ticket
    container.classList.add('active');
    container.setAttribute('aria-hidden', 'false');

    // Guardar en localStorage (verificar que utils esté disponible)
    if (typeof utils !== 'undefined' && utils.saveTicketToStorage) {
        utils.saveTicketToStorage(movie.id, {
            movie: movie.title,
            timestamp: Date.now()
        });
    } else {
        console.warn('utils no disponible, guardando directamente en localStorage');
        try {
            localStorage.setItem(`ticket_${movie.id}`, JSON.stringify({
                obtained: true,
                movie: movie.title,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('Error guardando en localStorage:', e);
            // Mostrar mensaje si no se puede guardar (modo incógnito, storage deshabilitado)
            showMessage('⚠️ No se pudo guardar el ticket. Algunos navegadores bloquean el almacenamiento en modo incógnito.', 'error');
            return;
        }
    }

    // Mostrar confirmación visual de guardado
    showSaveConfirmation();

    // Deshabilitar botón de ticket
    const ticketBtn = document.querySelector(`[data-movie="${movie.id}"]`);
    if (ticketBtn) {
        ticketBtn.disabled = true;
        ticketBtn.textContent = 'Ticket ya obtenido 💌';
    }

    // Reproducir sonido
    if (typeof utils !== 'undefined' && utils.playSound) {
        utils.playSound('ticket');
    }

    // Remover animación después de completarse
    setTimeout(() => {
        ticket.classList.remove('print-animation');
    }, 800);
}

function flipTicket(flip) {
    const ticket = document.getElementById('ticket');
    if (!ticket) return;

    if (flip) {
        ticket.classList.add('flipped');
    } else {
        ticket.classList.remove('flipped');
    }
}

function closeTicket() {
    const container = document.getElementById('ticket-container');
    if (container) {
        container.classList.remove('active');
        container.setAttribute('aria-hidden', 'true');
    }
}

// Mini-juego de estrellas
function setupStarsGame() {
    const stars = document.querySelectorAll('.star');
    const backBtn = document.getElementById('back-to-cartelera');
    const closeBtn = document.getElementById('close-stars-game');
    const messageEl = document.getElementById('star-message');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            revealStarMessage(index, messageEl);
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', hideStarsGame);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideStarsGame);
    }

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const game = document.getElementById('stars-game');
            if (game?.classList.contains('active')) {
                hideStarsGame();
            }
        }
    });
}

function showStarsGame() {
    const game = document.getElementById('stars-game');
    if (game) {
        game.classList.add('active');
        game.setAttribute('aria-hidden', 'false');
        
        // Resetear juego
        revealedStars.clear();
        resetConstellationGame();
    } else {
        console.error('Error: stars-game no encontrado');
    }
}

function resetConstellationGame() {
    const messageEl = document.getElementById('star-message');
    const progressEl = document.getElementById('constellation-progress');
    const completeEl = document.getElementById('constellation-complete');
    const stars = document.querySelectorAll('.star');
    
    // Resetear estrellas
    stars.forEach(star => {
        star.classList.remove('revealed', 'active');
        star.style.opacity = '1';
    });
    
    // Resetear mensaje progresivo
    if (progressEl) {
        progressEl.innerHTML = '';
        progressEl.className = 'constellation-progress';
    }
    
    if (messageEl) {
        messageEl.classList.remove('active', 'reveal');
    }
    
    // Ocultar animación final
    if (completeEl) {
        completeEl.classList.remove('active');
        completeEl.setAttribute('aria-hidden', 'true');
    }
}

function hideStarsGame() {
    const game = document.getElementById('stars-game');
    const completeEl = document.getElementById('constellation-complete');
    
    if (game) {
        game.classList.remove('active');
        game.setAttribute('aria-hidden', 'true');
    }
    
    // Cerrar también la animación final si está abierta
    if (completeEl) {
        completeEl.classList.remove('active');
        completeEl.setAttribute('aria-hidden', 'true');
    }
    
    // Resetear al cerrar
    resetConstellationGame();
}

function revealStarMessage(starIndex, messageEl) {
    if (!messageEl) return;
    
    // Verificar si ya fue revelada
    if (revealedStars.has(starIndex)) {
        return;
    }
    
    // Marcar como revelada
    revealedStars.add(starIndex);
    
    const progressEl = document.getElementById('constellation-progress');
    if (!progressEl) return;
    
    // Agregar parte del mensaje
    const messagePart = CONSTELLATION_MESSAGE[starIndex];
    if (messagePart) {
        const partSpan = document.createElement('span');
        partSpan.className = 'message-part';
        partSpan.textContent = messagePart;
        partSpan.style.opacity = '0';
        partSpan.style.transform = 'translateY(10px)';
        progressEl.appendChild(partSpan);
        
        // Animar entrada
        setTimeout(() => {
            partSpan.style.transition = 'all 0.5s ease';
            partSpan.style.opacity = '1';
            partSpan.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Mostrar contenedor de mensaje
    messageEl.classList.add('active');
    
    // Animación de la estrella
    const star = document.querySelector(`[data-star="${starIndex}"]`);
    if (star) {
        star.classList.add('revealed', 'active');
        star.style.animation = 'starReveal 0.6s ease';
        setTimeout(() => {
            star.style.animation = '';
        }, 600);
    }
    
    // Verificar si se completó la constelación
    if (revealedStars.size === CONSTELLATION_MESSAGE.length) {
        setTimeout(() => {
            showConstellationComplete();
        }, 800);
    }
}

function showConstellationComplete() {
    const completeEl = document.getElementById('constellation-complete');
    const completeMessageEl = document.getElementById('complete-message');
    const songBtn = document.getElementById('surprise-song-btn');
    
    if (!completeEl) return;
    
    // Construir mensaje completo
    const fullMessage = CONSTELLATION_MESSAGE.join(' ');
    if (completeMessageEl) {
        completeMessageEl.textContent = fullMessage;
    }
    
    // Configurar botón de canción
    if (songBtn) {
        songBtn.href = SURPRISE_SONG;
    }
    
    // Mostrar animación final
    completeEl.classList.add('active');
    completeEl.setAttribute('aria-hidden', 'false');
    
    // Reproducir sonido de celebración
    if (typeof utils !== 'undefined' && utils.playSound) {
        utils.playSound('success');
    }
    
    // Animación de entrada
    setTimeout(() => {
        completeEl.style.opacity = '1';
        completeEl.style.transform = 'scale(1)';
    }, 100);
}

// Control de sonido
function toggleMute() {
    muted = !muted;
    localStorage.setItem('sounds_muted', muted.toString());
    
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        updateMuteButton(muteBtn);
    }
}

function updateMuteButton(btn) {
    if (muted) {
        btn.textContent = '🔇';
        btn.setAttribute('aria-label', 'Activar sonidos');
    } else {
        btn.textContent = '🔊';
        btn.setAttribute('aria-label', 'Silenciar sonidos');
    }
}

// Sistema de Navegación
function setupNavigation() {
    const navMovies = document.getElementById('nav-movies');
    const navTickets = document.getElementById('nav-tickets');
    const mainContent = document.getElementById('main-content');
    const ticketsSection = document.getElementById('my-tickets-section');

    if (navMovies) {
        navMovies.addEventListener('click', () => {
            showSection('movies');
        });
    }

    if (navTickets) {
        navTickets.addEventListener('click', () => {
            showSection('tickets');
        });
    }

    // Inicializar con sección de películas
    showSection('movies');
}

function showSection(sectionName) {
    const mainContent = document.getElementById('main-content');
    const ticketsSection = document.getElementById('my-tickets-section');
    const navMovies = document.getElementById('nav-movies');
    const navTickets = document.getElementById('nav-tickets');

    // Actualizar navbar
    if (navMovies && navTickets) {
        navMovies.classList.remove('active');
        navTickets.classList.remove('active');

        if (sectionName === 'movies') {
            navMovies.classList.add('active');
            if (mainContent) {
                mainContent.classList.add('active');
            }
            if (ticketsSection) {
                ticketsSection.classList.remove('active');
            }
        } else if (sectionName === 'tickets') {
            navTickets.classList.add('active');
            if (ticketsSection) {
                ticketsSection.classList.add('active');
                loadSavedTickets(); // Recargar tickets
            }
            if (mainContent) {
                mainContent.classList.remove('active');
            }
        }
    }
}

function updateTicketsBadge() {
    const badge = document.getElementById('tickets-badge');
    if (!badge) return;

    let ticketCount = 0;
    Object.keys(MOVIES).forEach(movieId => {
        let ticketData = null;
        if (typeof utils !== 'undefined' && utils.getTicketData) {
            ticketData = utils.getTicketData(movieId);
        } else {
            try {
                const data = localStorage.getItem(`ticket_${movieId}`);
                if (data) {
                    ticketData = JSON.parse(data);
                }
            } catch (e) {
                // Ignorar errores
            }
        }
        if (ticketData && ticketData.obtained) {
            ticketCount++;
        }
    });

    if (ticketCount > 0) {
        badge.textContent = ticketCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Sección Mis Tickets (Carrito)
function setupMyTicketsSection() {
    const closeTicketsBtn = document.getElementById('close-tickets-btn');
    const ticketsSection = document.getElementById('my-tickets-section');

    if (closeTicketsBtn) {
        closeTicketsBtn.addEventListener('click', () => {
            showSection('movies');
        });
    }
}


function addTicketToMyTickets(movie) {
    const ticketsList = document.getElementById('tickets-list');
    if (!ticketsList) return;

    // Remover mensaje de "no tickets"
    const noTicketsMsg = ticketsList.querySelector('.no-tickets-message');
    if (noTicketsMsg) {
        noTicketsMsg.remove();
    }

    // Crear elemento de ticket
    const ticketCard = document.createElement('div');
    ticketCard.className = 'ticket-card';
    ticketCard.dataset.movieId = movie.id;
    
    ticketCard.innerHTML = `
        <div class="ticket-card-header">
            <h3 class="ticket-card-title">${movie.title}</h3>
            <span class="ticket-card-year">${movie.year}</span>
        </div>
        <div class="ticket-card-details">
            <div class="ticket-card-row">
                <span>🕒 Hora:</span>
                <span>9:30 PM</span>
            </div>
            <div class="ticket-card-row">
                <span>📍 Lugar:</span>
                <span>En casa (Meet)</span>
            </div>
            <div class="ticket-card-actions">
                <a href="${movie.meetLink}" target="_blank" rel="noopener noreferrer" class="ticket-card-link">🔗 Unirse a Discord</a>
                <a href="${movie.specialLink ? movie.specialLink.url : '#'}" target="_blank" rel="noopener noreferrer" class="ticket-card-link ${movie.specialLink && movie.specialLink.highlight ? 'highlight-link' : ''}">${movie.specialLink ? movie.specialLink.label : '🎵 Link especial'}</a>
            </div>
        </div>
    `;

    // Agregar con animación
    ticketCard.style.opacity = '0';
    ticketCard.style.transform = 'translateY(20px)';
    ticketsList.appendChild(ticketCard);

    // Animar entrada
    setTimeout(() => {
        ticketCard.style.transition = 'all 0.4s ease';
        ticketCard.style.opacity = '1';
        ticketCard.style.transform = 'translateY(0)';
    }, 10);

    // Actualizar badge
    updateTicketsBadge();
}

function loadSavedTickets() {
    const ticketsList = document.getElementById('tickets-list');
    if (!ticketsList) return;

    // Limpiar lista (excepto mensaje de no tickets)
    const existingTickets = ticketsList.querySelectorAll('.ticket-card');
    existingTickets.forEach(ticket => ticket.remove());

    // Cargar tickets desde localStorage
    let hasTickets = false;

    Object.keys(MOVIES).forEach(movieId => {
        let ticketData = null;
        
        if (typeof utils !== 'undefined' && utils.getTicketData) {
            ticketData = utils.getTicketData(movieId);
        } else {
            try {
                const data = localStorage.getItem(`ticket_${movieId}`);
                if (data) {
                    ticketData = JSON.parse(data);
                }
            } catch (e) {
                console.error('Error leyendo ticket:', e);
            }
        }

        if (ticketData && ticketData.obtained) {
            hasTickets = true;
            addTicketToMyTickets(MOVIES[movieId]);
        }
    });

    // Mostrar mensaje si no hay tickets
    if (!hasTickets) {
        const noTicketsMsg = document.createElement('p');
        noTicketsMsg.className = 'no-tickets-message';
        noTicketsMsg.textContent = 'Aún no has obtenido ningún ticket. ¡Obtén tus tickets desde la cartelera! 🎬';
        ticketsList.appendChild(noTicketsMsg);
    }

    // Actualizar badge del navbar
    updateTicketsBadge();
}

// Utilidad para mostrar mensajes
function showMessage(text, type = 'info') {
    // Implementación simple de mensaje toast
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    const colors = {
        info: 'var(--accent)',
        success: 'var(--gold)',
        error: 'var(--accent)'
    };
    
    message.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--card);
        color: var(--text);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        border: 2px solid ${colors[type] || colors.info};
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 32px var(--shadow);
        max-width: 350px;
        font-size: 0.9rem;
        line-height: 1.5;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, type === 'error' ? 5000 : 3000);
}

// Mostrar confirmación de guardado
function showSaveConfirmation() {
    const savedIndicator = document.createElement('div');
    savedIndicator.className = 'save-indicator';
    savedIndicator.innerHTML = '💾 Guardado en tu navegador';
    savedIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--card);
        color: var(--gold);
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        border: 2px solid var(--gold);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 32px var(--shadow);
        font-size: 0.85rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(savedIndicator);
    
    setTimeout(() => {
        savedIndicator.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            savedIndicator.remove();
        }, 300);
    }, 2000);
}

