import type { AuthProvider } from 'react-admin';
import { supabase } from '../lib/supabaseClient';

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    const { error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    if (error) throw error;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      throw new Error('Not authenticated');
    }
  },

  async checkError() {
    return Promise.resolve();
  },

  async getIdentity() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw new Error('No user');
    }
    return {
      id: data.user.id,
      fullName: data.user.email ?? 'Admin',
    };
  },

  async getPermissions() {
    return [];
  },
};
