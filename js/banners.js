import supabase from './supabase.js';
import { getCurrentUser, signOut } from './auth.js';

let currentBannerId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar banners del usuario
    await loadUserBanners(currentUser.id);

    // Configurar formulario
    const bannerForm = document.getElementById('banner-form');
    bannerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const imageUrl = document.getElementById('image-url').value;
        const targetUrl = document.getElementById('target-url').value;
        const isActive = document.getElementById('is-active').checked;

        if (currentBannerId) {
            await updateBanner(currentBannerId, title, imageUrl, targetUrl, isActive);
        } else {
            await createBanner(currentUser.id, title, imageUrl, targetUrl, isActive);
        }

        bannerForm.reset();
        currentBannerId = null;
        await loadUserBanners(currentUser.id);
    });

    // Manejar cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut();
        window.location.href = 'index.html';
    });
});

async function loadUserBanners(userId) {
    const { data: banners, error } = await supabase
        .from('banners')
        .select('*')
        .eq('user_id', userId)
        .eq('is_featured', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error cargando banners:', error);
        return;
    }

    const bannersList = document.getElementById('banners-list');
    bannersList.innerHTML = banners.map(banner => `
    <div class="banner-item ${banner.is_active ? 'active' : 'inactive'}">
      <img src="${banner.image_url}" alt="${banner.title}">
      <div class="banner-info">
        <h3>${banner.title}</h3>
        <p>${banner.is_active ? 'Activo' : 'Inactivo'}</p>
        <p>${new Date(banner.created_at).toLocaleDateString()}</p>
      </div>
      <div class="banner-actions">
        <button class="btn edit-btn" data-id="${banner.id}">Editar</button>
        <button class="btn toggle-btn" data-id="${banner.id}" data-active="${banner.is_active}">
          ${banner.is_active ? 'Desactivar' : 'Activar'}
        </button>
        <button class="btn delete-btn" data-id="${banner.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

    // Configurar botones de acción
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const bannerId = e.target.dataset.id;
            await loadBannerForEdit(bannerId);
        });
    });

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const bannerId = e.target.dataset.id;
            const isActive = e.target.dataset.active === 'true';
            await toggleBannerStatus(bannerId, !isActive);
            await loadUserBanners(userId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const bannerId = e.target.dataset.id;
            if (confirm('¿Estás seguro de eliminar este banner?')) {
                await deleteBanner(bannerId);
                await loadUserBanners(userId);
            }
        });
    });
}

async function loadBannerForEdit(bannerId) {
    const { data: banner, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', bannerId)
        .single();

    if (error) {
        console.error('Error cargando banner:', error);
        return;
    }

    currentBannerId = bannerId;
    document.getElementById('title').value = banner.title;
    document.getElementById('image-url').value = banner.image_url;
    document.getElementById('target-url').value = banner.target_url;
    document.getElementById('is-active').checked = banner.is_active;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function createBanner(userId, title, imageUrl, targetUrl, isActive) {
    const { error } = await supabase
        .from('banners')
        .insert([
            {
                user_id: userId,
                title,
                image_url: imageUrl,
                target_url: targetUrl,
                is_active: isActive,
                is_featured: false
            }
        ]);

    if (error) {
        console.error('Error creando banner:', error);
        alert('Error al crear el banner. Verifica que no excedas el límite de 5 banners.');
        return false;
    }

    return true;
}

async function updateBanner(bannerId, title, imageUrl, targetUrl, isActive) {
    const { error } = await supabase
        .from('banners')
        .update({
            title,
            image_url: imageUrl,
            target_url: targetUrl,
            is_active: isActive,
            updated_at: new Date().toISOString()
        })
        .eq('id', bannerId);

    if (error) {
        console.error('Error actualizando banner:', error);
        return false;
    }

    return true;
}

async function toggleBannerStatus(bannerId, isActive) {
    const { error } = await supabase
        .from('banners')
        .update({
            is_active: isActive,
            updated_at: new Date().toISOString()
        })
        .eq('id', bannerId);

    if (error) {
        console.error('Error cambiando estado del banner:', error);
        return false;
    }

    return true;
}

async function deleteBanner(bannerId) {
    const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', bannerId);

    if (error) {
        console.error('Error eliminando banner:', error);
        return false;
    }

    return true;
}