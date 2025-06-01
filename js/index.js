// index.js - Funcionalidades específicas para index.html
import { getCurrentUser, signOut } from './auth.js';

// Función para manejar el cierre de sesión
async function handleLogout() {
    try {
        await signOut();
        // Redirigir al index y forzar recarga para actualizar el estado
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Ocurrió un error al intentar cerrar sesión');
    }
}

// Función para actualizar la UI según el estado de autenticación
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const dashboardLink = document.getElementById('dashboard-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    if (currentUser) {
        // Usuario autenticado
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
    } else {
        // Usuario no autenticado
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
    }
}

// Configurar el evento de cierre de sesión
function setupLogout() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    setupLogout();
});