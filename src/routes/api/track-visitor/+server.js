import { json } from '@sveltejs/kit';

export async function POST({ request, getClientAddress }) {
	try {
		const { page, referrer } = await request.json();
		const ip = getClientAddress();
		const userAgent = request.headers.get('user-agent');

		const visitorData = {
			ip,
			userAgent,
			page,
			referrer: referrer || '',
			timestamp: new Date().toISOString()
		};

		// In a real app, you would save this to a database
		console.log('Visitor tracked:', visitorData);

		// TODO: Save to database using Prisma
		// await prisma.visitor.create({ data: visitorData });

		return json({ success: true, data: visitorData });
	} catch (error) {
		console.error('Track visitor error:', error);
		return json({ error: 'Failed to track visitor' }, { status: 500 });
	}
}
