import { supabase } from './supabase.js';

// Registrar usuario con email y contraseña
export async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password
    });

    console.log(error)
    if (error) throw error;
    return user;
}

// Iniciar sesión con email y contraseña
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) throw error;
    return data.user;
}

// Iniciar sesión con GitHub
export async function signInWithGitHub() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/' // Opcional: URL de callback
            }
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('GitHub Auth Error:', error);
        throw error;
    }
}

// Cerrar sesión
// export async function signOut() {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
// }


export async function signOut() {
    // Limpia la sesión del proveedor (especialmente importante para GitHub)
    try {
        // Cierra sesión en Supabase
        const { error } = await supabase.auth.signOut();

        // Para GitHub/OAuth, redirige explícitamente
        console.log("Cerrando session")
        window.location.href = `https://ewaqfqtlbknrzzxeamuv.supabase.co/logout`;
        // Reemplaza con tu URL de Supabase

        if (error) throw error;
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
    }
}



// Obtener usuario actual
// export function getCurrentUser() {
//     return supabase.auth.user();
// }

// Obtener usuario actual (versión actualizada para Supabase v2+)
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Escuchar cambios de autenticación
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}