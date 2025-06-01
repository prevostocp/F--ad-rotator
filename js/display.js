import { supabase } from './supabase.js';
import { getCurrentUser, signOut } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener parámetro de usuario de la URL
    const urlParams = new URLSearchParams(window.location.search);
    //const userId = urlParams.get('user') || (getCurrentUser()?.id || null);

    // Mostrar/navegación según autenticación
    //const currentUser = getCurrentUser();
    const currentUser = await getCurrentUser(); // <-- Ahora con await
    const userId = urlParams.get('user') || (currentUser?.id || null);
    const dashboardLink = document.getElementById('dashboard-link');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');

    if (currentUser) {
        dashboardLink.style.display = 'inline';
        logoutLink.style.display = 'inline';
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
    } else {
        dashboardLink.style.display = 'none';
        logoutLink.style.display = 'none';
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
    }

    // Manejar cierre de sesión
    logoutLink?.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut();
        window.location.href = 'index.html';
    });

    // Cargar y mostrar ads y banners
    await loadAndDisplayAds(userId);
    await loadAndDisplayBanners(userId);
});

async function loadAndDisplayAds(userId) {
    try {
        // Obtener ads destacados (6 aleatorios)
        const { data: featuredAds, error: featuredError } = await supabase
            .from('ads')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true);

        if (!featuredError && featuredAds.length > 0) {
            const shuffledFeatured = [...featuredAds].sort(() => 0.5 - Math.random());
            const topFeatured = shuffledFeatured.slice(0, 3);
            const bottomFeatured = shuffledFeatured.slice(3, 6);

            displayAds(topFeatured, 'featured-ads-top');
            displayAds(bottomFeatured, 'featured-ads-bottom');
        }

        // Obtener ads del usuario si hay userId
        if (userId) {
            const { data: userAds, error: userError } = await supabase
                .from('ads')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .eq('is_featured', false);

            if (!userError && userAds.length > 0) {
                displayAds(userAds, 'user-ads');
            } else {
                document.getElementById('user-ads').innerHTML =
                    '<p class="no-ads">No hay anuncios personales para mostrar</p>';
            }
        }
    } catch (error) {
        console.error('Error loading ads:', error);
    }
}

async function loadAndDisplayBanners(userId) {
    try {
        // Obtener banners destacados (6 aleatorios)
        const { data: featuredBanners, error: featuredError } = await supabase
            .from('banners')
            .select('*')
            .eq('is_featured', true)
            .eq('is_active', true);

        if (!featuredError && featuredBanners.length > 0) {
            const shuffledFeatured = [...featuredBanners].sort(() => 0.5 - Math.random());
            const topFeatured = shuffledFeatured.slice(0, 3);
            const bottomFeatured = shuffledFeatured.slice(3, 6);

            displayBanners(topFeatured, 'featured-banners-top');
            displayBanners(bottomFeatured, 'featured-banners-bottom');
        }

        // Obtener banners del usuario si hay userId
        if (userId) {
            const { data: userBanners, error: userError } = await supabase
                .from('banners')
                .select('*')
                .eq('user_id', userId)
                .eq('is_active', true)
                .eq('is_featured', false);

            if (!userError && userBanners.length > 0) {
                displayBanners(userBanners, 'user-banners');
            } else {
                document.getElementById('user-banners').innerHTML =
                    '<p class="no-banners">No hay banners personales para mostrar</p>';
            }
        }
    } catch (error) {
        console.error('Error loading banners:', error);
    }
}

function displayAds(ads, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ads.map(ad => `
    <div class="ad-card">
      <a href="${ad.target_url}" target="_blank" rel="noopener noreferrer">
        <img src="${ad.image_url}" alt="${ad.title}" loading="lazy">
        <div class="ad-overlay">
          <span>${ad.title}</span>
        </div>
      </a>
    </div>
  `).join('');
}

function displayBanners(banners, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = banners.map(banner => `
    <div class="banner-card">
      <a href="${banner.target_url}" target="_blank" rel="noopener noreferrer">
        <img src="${banner.image_url}" alt="${banner.title}" loading="lazy">
        <div class="banner-overlay">
          <span>${banner.title}</span>
        </div>
      </a>
    </div>
  `).join('');
}