import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const { id } = params;

	// Mock deleting media file - in a real app, this would delete from storage
	console.log(`Deleting media file ${id}`);

	return json({ success: true });
}
