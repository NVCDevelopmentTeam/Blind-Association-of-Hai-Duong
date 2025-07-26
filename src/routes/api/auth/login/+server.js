import { json } from '@sveltejs/kit';

// Mock authentication - in a real app, this would validate against a database
export async function POST({ request }) {
	const { email, password } = await request.json();

	// Mock validation
	if (email === 'admin@ttphcn-haiduong.vn' && password === 'admin123') {
		return json({
			token: 'mock-jwt-token',
			user: {
				id: 1,
				email: 'admin@ttphcn-haiduong.vn',
				name: 'Administrator',
				role: 'admin'
			}
		});
	} else if (email === 'user@example.com' && password === 'user123') {
		return json({
			token: 'mock-user-token',
			user: {
				id: 2,
				email: 'user@example.com',
				name: 'User',
				role: 'user'
			}
		});
	} else {
		return json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
	}
}
