import supabase from './supabase.js';

// Registrar usuario con email y contraseña
export async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) throw error;
    return user;
}

// Iniciar sesión con email y contraseña
export async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({
        email,
        password
    });

    if (error) throw error;
    return user;
}

// Iniciar sesión con GitHub
export async function signInWithGitHub() {
    const { user, error } = await supabase.auth.signIn({
        provider: 'github'
    });

    if (error) throw error;
    return user;
}

// Cerrar sesión
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// Obtener usuario actual
export function getCurrentUser() {
    return supabase.auth.user();
}

// Escuchar cambios de autenticación
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}