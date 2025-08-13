import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || typeof file === 'string') {
		return json({ error: 'No file uploaded' }, { status: 400 });
	}

	// Mock file upload - in a real app, you would save to storage
	const mockUploadedFile = {
		id: Date.now(),
		name: file.name,
		url: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(file.name)}`,
		type: file.type,
		size: file.size,
		uploadedAt: new Date().toISOString()
	};

	return json(mockUploadedFile);
}
