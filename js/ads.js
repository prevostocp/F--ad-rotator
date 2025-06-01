import supabase from './supabase.js';
import { getCurrentUser, signOut } from './auth.js';

let currentAdId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar ads del usuario
    await loadUserAds(currentUser.id);

    // Configurar formulario
    const adForm = document.getElementById('ad-form');
    adForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const imageUrl = document.getElementById('image-url').value;
        const targetUrl = document.getElementById('target-url').value;
        const isActive = document.getElementById('is-active').checked;

        if (currentAdId) {
            await updateAd(currentAdId, title, imageUrl, targetUrl, isActive);
        } else {
            await createAd(currentUser.id, title, imageUrl, targetUrl, isActive);
        }

        adForm.reset();
        currentAdId = null;
        await loadUserAds(currentUser.id);
    });

    // Manejar cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut();
        window.location.href = 'index.html';
    });
});

async function loadUserAds(userId) {
    const { data: ads, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', userId)
        .eq('is_featured', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error cargando anuncios:', error);
        return;
    }

    const adsList = document.getElementById('ads-list');
    adsList.innerHTML = ads.map(ad => `
    <div class="ad-item ${ad.is_active ? 'active' : 'inactive'}">
      <img src="${ad.image_url}" alt="${ad.title}">
      <div class="ad-info">
        <h3>${ad.title}</h3>
        <p>${ad.is_active ? 'Activo' : 'Inactivo'}</p>
        <p>${new Date(ad.created_at).toLocaleDateString()}</p>
      </div>
      <div class="ad-actions">
        <button class="btn edit-btn" data-id="${ad.id}">Editar</button>
        <button class="btn toggle-btn" data-id="${ad.id}" data-active="${ad.is_active}">
          ${ad.is_active ? 'Desactivar' : 'Activar'}
        </button>
        <button class="btn delete-btn" data-id="${ad.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

    // Configurar botones de acción
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const adId = e.target.dataset.id;
            await loadAdForEdit(adId);
        });
    });

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const adId = e.target.dataset.id;
            const isActive = e.target.dataset.active === 'true';
            await toggleAdStatus(adId, !isActive);
            await loadUserAds(userId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const adId = e.target.dataset.id;
            if (confirm('¿Estás seguro de eliminar este anuncio?')) {
                await deleteAd(adId);
                await loadUserAds(userId);
            }
        });
    });
}

async function loadAdForEdit(adId) {
    const { data: ad, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', adId)
        .single();

    if (error) {
        console.error('Error cargando anuncio:', error);
        return;
    }

    currentAdId = adId;
    document.getElementById('title').value = ad.title;
    document.getElementById('image-url').value = ad.image_url;
    document.getElementById('target-url').value = ad.target_url;
    document.getElementById('is-active').checked = ad.is_active;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function createAd(userId, title, imageUrl, targetUrl, isActive) {
    const { error } = await supabase
        .from('ads')
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
        console.error('Error creando anuncio:', error);
        alert('Error al crear el anuncio. Verifica que no excedas el límite de 5 anuncios.');
        return false;
    }

    return true;
}

async function updateAd(adId, title, imageUrl, targetUrl, isActive) {
    const { error } = await supabase
        .from('ads')
        .update({
            title,
            image_url: imageUrl,
            target_url: targetUrl,
            is_active: isActive,
            updated_at: new Date().toISOString()
        })
        .eq('id', adId);

    if (error) {
        console.error('Error actualizando anuncio:', error);
        return false;
    }

    return true;
}

async function toggleAdStatus(adId, isActive) {
    const { error } = await supabase
        .from('ads')
        .update({
            is_active: isActive,
            updated_at: new Date().toISOString()
        })
        .eq('id', adId);

    if (error) {
        console.error('Error cambiando estado del anuncio:', error);
        return false;
    }

    return true;
}

async function deleteAd(adId) {
    const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId);

    if (error) {
        console.error('Error eliminando anuncio:', error);
        return false;
    }

    return true;
}