<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let { value = '', placeholder = 'Nhập nội dung...', onchange } = $props();
  let editorElement = $state(null);
  let quill = $state(null);
  
  onMount(async () => {
    if (browser && window.Quill) {
      // Configure Quill
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ];
      
      quill = new window.Quill(editorElement, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: toolbarOptions
        }
      });
      
      // Set initial content
      if (value) {
        quill.root.innerHTML = value;
      }
      
      // Listen for changes
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        if (onchange) {
          onchange(content);
        }
      });
    }
  });
  
  // Update content when value prop changes
  $effect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.root.innerHTML = value;
    }
  });
</script>

<div class="quill-editor">
  <div bind:this={editorElement} class="min-h-[300px]"></div>
</div>

<style>
  :global(.ql-editor) {
    min-height: 300px;
    font-size: 16px;
    line-height: 1.6;
  }
  
  :global(.ql-toolbar) {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  
  :global(.ql-container) {
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
</style>
