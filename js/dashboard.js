import supabase from './supabase.js';
import { getCurrentUser, signOut } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Configurar enlace público
    const publicLinkInput = document.getElementById('public-link');
    const copyLinkBtn = document.getElementById('copy-link');

    const publicLink = `${window.location.origin}/index.html?user=${currentUser.id}`;
    publicLinkInput.value = publicLink;

    copyLinkBtn.addEventListener('click', () => {
        publicLinkInput.select();
        document.execCommand('copy');
        copyLinkBtn.textContent = 'Copiado!';
        setTimeout(() => {
            copyLinkBtn.textContent = 'Copiar';
        }, 2000);
    });

    // Cargar estadísticas
    await loadUserStats(currentUser.id);

    // Manejar cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut();
        window.location.href = 'index.html';
    });
});

async function loadUserStats(userId) {
    // Obtener banners del usuario
    const { count: bannersCount } = await supabase
        .from('banners')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_featured', false);

    // Obtener banners activos
    const { count: activeBannersCount } = await supabase
        .from('banners')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('is_featured', false);

    // Mostrar estadísticas de banners
    const bannersStats = document.getElementById('user-banners-stats');
    bannersStats.innerHTML = `
    <p>Total: ${bannersCount}/5</p>
    <p>Activos: ${activeBannersCount}</p>
  `;

    // Obtener ads del usuario
    const { count: adsCount } = await supabase
        .from('ads')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_featured', false);

    // Obtener ads activos
    const { count: activeAdsCount } = await supabase
        .from('ads')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('is_featured', false);

    // Mostrar estadísticas de ads
    const adsStats = document.getElementById('user-ads-stats');
    adsStats.innerHTML = `
    <p>Total: ${adsCount}/5</p>
    <p>Activos: ${activeAdsCount}</p>
  `;
}