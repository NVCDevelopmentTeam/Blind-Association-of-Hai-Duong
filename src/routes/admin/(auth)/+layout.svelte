<script>
	import '../../../app.css';
	
	let { children } = $props();
</script>

<div class="auth-layout min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
	{@render children()}
</div>
