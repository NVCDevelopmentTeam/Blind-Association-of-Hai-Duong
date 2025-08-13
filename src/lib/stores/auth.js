import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
	const { subscribe, set, update } = writable({
		isAuthenticated: false,
		user: null,
		token: null
	});

	return {
		subscribe,
		/**
		 * @param {any} userData
		 * @param {any} token
		 */
		login: (userData, token) => {
			if (browser) {
				localStorage.setItem('admin_token', token);
				localStorage.setItem('admin_user', JSON.stringify(userData));
			}
			set({
				isAuthenticated: true,
				user: userData,
				token: token
			});
		},
		logout: () => {
			if (browser) {
				localStorage.removeItem('admin_token');
				localStorage.removeItem('admin_user');
				localStorage.removeItem('remember_admin');
			}
			set({
				isAuthenticated: false,
				user: null,
				token: null
			});
		},
		checkAuth: async () => {
			if (!browser) return;

			const token = localStorage.getItem('admin_token');
			const userStr = localStorage.getItem('admin_user');

			if (!token || !userStr) {
				return;
			}

			try {
				const response = await fetch('http://localhost:3001/api/auth/verify', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				if (response.ok) {
					const userData = JSON.parse(userStr);
					set({
						isAuthenticated: true,
						user: userData,
						token
					});
				} else {
					// Token is invalid, clear storage
					localStorage.removeItem('admin_token');
					localStorage.removeItem('admin_user');
				}
			} catch (error) {
				console.error('Auth check error:', error);
				localStorage.removeItem('admin_token');
				localStorage.removeItem('admin_user');
			}
		}
	};
}

export const authStore = createAuthStore();
