<script>
  let { children } = $props();
</script>

<article class="prose prose-lg max-w-none dark:prose-invert">
  {@render children()}
</article>
