<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { writable } from 'svelte/store';
  
  let { data } = $props();
  
  let quillEditor;
  let editorContainer;
  let form;
  let submitButton;
  
  const loading = writable(false);
  const errors = writable({});
  
  // Form data
  let postData = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'DRAFT',
    categoryId: '',
    tags: []
  };
  
  const categories = writable([]);
  const availableTags = writable([]);
  
  onMount(async () => {
    // Initialize Quill editor
    if (window.Quill && editorContainer) {
      quillEditor = new window.Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
          ]
        },
        placeholder: 'Viết nội dung bài viết của bạn...'
      });
      
      // Update content when editor changes
      quillEditor.on('text-change', () => {
        postData.content = quillEditor.root.innerHTML;
      });
    }
    
    // Load categories and tags
    await loadCategoriesAndTags();
  });
  
  async function loadCategoriesAndTags() {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tags')
      ]);
      
      if (categoriesRes.ok) {
        categories.set(await categoriesRes.json());
      }
      
      if (tagsRes.ok) {
        availableTags.set(await tagsRes.json());
      }
    } catch (error) {
      console.error('Error loading categories and tags:', error);
    }
  }
  
  function generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  
  function handleTitleChange(event) {
    postData.title = event.target.value;
    if (!postData.slug) {
      postData.slug = generateSlug(postData.title);
    }
  }
  
  function toggleTag(tagId) {
    if (postData.tags.includes(tagId)) {
      postData.tags = postData.tags.filter(id => id !== tagId);
    } else {
      postData.tags = [...postData.tags, tagId];
    }
  }
  
  async function handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          postData.featuredImage = result.url;
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    };
    
    input.click();
  }
  
  function handleSubmit() {
    errors.set({});
    
    // Validation
    if (!postData.title.trim()) {
      errors.update({ title: 'Tiêu đề là bắt buộc' });
      return false;
    }
    
    if (!postData.slug.trim()) {
      errors.update({ slug: 'Slug là bắt buộc' });
      return false;
    }
    
    if (!postData.content.trim() || postData.content === '<p><br></p>') {
      errors.update({ content: 'Nội dung là bắt buộc' });
      return false;
    }
    
    if (Object.keys($errors).length > 0) {
      return false;
    }
    
    $loading = true;
    return true;
  }
  
  function handleResult({ result }) {
    $loading = false;
    
    if (result.type === 'success') {
      goto('/admin/posts');
    } else if (result.type === 'failure') {
      errors.update(result.data?.errors || {});
      if (result.data?.message) {
        errors.update({ general: result.data.message });
      }
    }
  }
</script>

<svelte:head>
  <title>Thêm bài viết mới - Admin Panel</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Thêm bài viết mới</h1>
      <div class="flex space-x-3">
        <a href="/admin/posts" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Hủy
        </a>
        <button 
          bind:this={submitButton}
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {$loading ? 'Đang lưu...' : 'Lưu bài viết'}
        </button>
      </div>
    </div>
  </div>

  <form 
    id="post-form"
    bind:this={form}
    method="POST"
    action="?/create"
    use:enhance={({ formData, cancel }) => {
      if (!handleSubmit()) {
        cancel();
        return;
      }
      
      // Add form data
      formData.set('title', postData.title);
      formData.set('slug', postData.slug);
      formData.set('content', postData.content);
      formData.set('excerpt', postData.excerpt);
      formData.set('featuredImage', postData.featuredImage);
      formData.set('status', postData.status);
      formData.set('categoryId', postData.categoryId);
      formData.set('tags', JSON.stringify(postData.tags));
      
      return handleResult;
    }}
    class="grid grid-cols-1 lg:grid-cols-3 gap-6"
  >
    <!-- Main content -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Title -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề *
            </label>
            <input
              id="title"
              type="text"
              bind:value={postData.title}
              oninput={handleTitleChange}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              class:border-red-500={$errors.title}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
            {#if $errors.title}
              <p class="mt-1 text-sm text-red-600">{$errors.title}</p>
            {/if}
          </div>
          
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              id="slug"
              type="text"
              bind:value={postData.slug}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              class:border-red-500={$errors.slug}
              placeholder="url-bai-viet"
            />
            {#if $errors.slug}
              <p class="mt-1 text-sm text-red-600">{$errors.slug}</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Content editor -->
      <div class="bg-white rounded-lg shadow p-6">
        <label for="content" class="block text-sm font-medium text-gray-700 mb-4">
          Nội dung *
        </label>
        <div 
          bind:this={editorContainer}
          id="content"
          class="min-h-[400px] border border-gray-300 rounded-md"
          class:border-red-500={$errors.content}
        ></div>
        {#if $errors.content}
          <p class="mt-2 text-sm text-red-600">{$errors.content}</p>
        {/if}
      </div>

      <!-- Excerpt -->
      <div class="bg-white rounded-lg shadow p-6">
        <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
          Tóm tắt
        </label>
        <textarea
          id="excerpt"
          bind:value={postData.excerpt}
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tóm tắt ngắn gọn về bài viết"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500">Nếu để trống, hệ thống sẽ tự động tạo tóm tắt từ nội dung.</p>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Publish settings -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Xuất bản</h3>
        <div class="space-y-4">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              id="status"
              bind:value={postData.status}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DRAFT">Nháp</option>
              <option value="PUBLISHED">Xuất bản</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Featured image -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Ảnh đại diện</h3>
        {#if postData.featuredImage}
          <div class="mb-4">
            <img 
              src={postData.featuredImage || "/placeholder.svg"} 
              alt="Featured" 
              class="w-full h-32 object-cover rounded-md"
            />
            <button 
              type="button"
              onclick={() => postData.featuredImage = ''}
              class="mt-2 text-sm text-red-600 hover:text-red-500"
            >
              Xóa ảnh
            </button>
          </div>
        {:else}
          <button 
            type="button"
            onclick={handleImageUpload}
            class="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div class="text-center">
              <i class="fas fa-image text-2xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-600">Chọn ảnh đại diện</p>
            </div>
          </button>
        {/if}
      </div>

      <!-- Categories -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Danh mục</h3>
        <select
          bind:value={postData.categoryId}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn danh mục</option>
          {#each $categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>

      <!-- Tags -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Thẻ</h3>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          {#each $availableTags as tag}
            <label class="flex items-center">
              <input
                type="checkbox"
                checked={postData.tags.includes(tag.id)}
                onchange={() => toggleTag(tag.id)}
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">{tag.name}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>
  </form>

  {#if $errors.general}
    <div class="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-sm text-red-600">{$errors.general}</p>
    </div>
  {/if}

  <script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import { writable } from 'svelte/store';
    
    let { data } = $props();
    
    let quillEditor;
    let editorContainer;
    let form;
    let submitButton;
    
    const loading = writable(false);
    const errors = writable({});
    
    // Form data
    let postData = {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      status: 'DRAFT',
      categoryId: '',
      tags: []
    };
    
    const categories = writable([]);
    const availableTags = writable([]);
    
    onMount(async () => {
      // Initialize Quill editor
      if (window.Quill && editorContainer) {
        quillEditor = new window.Quill(editorContainer, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['blockquote', 'code-block'],
              ['clean']
            ]
          },
          placeholder: 'Viết nội dung bài viết của bạn...'
        });
        
        // Update content when editor changes
        quillEditor.on('text-change', () => {
          postData.content = quillEditor.root.innerHTML;
        });
      }
      
      // Load categories and tags
      await loadCategoriesAndTags();
    });
    
    async function loadCategoriesAndTags() {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/tags')
        ]);
        
        if (categoriesRes.ok) {
          categories.set(await categoriesRes.json());
        }
        
        if (tagsRes.ok) {
          availableTags.set(await tagsRes.json());
        }
      } catch (error) {
        console.error('Error loading categories and tags:', error);
      }
    }
    
    function generateSlug(title) {
      return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
    }
    
    function handleTitleChange(event) {
      postData.title = event.target.value;
      if (!postData.slug) {
        postData.slug = generateSlug(postData.title);
      }
    }
    
    function toggleTag(tagId) {
      if (postData.tags.includes(tagId)) {
        postData.tags = postData.tags.filter(id => id !== tagId);
      } else {
        postData.tags = [...postData.tags, tagId];
      }
    }
    
    async function handleImageUpload() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const result = await response.json();
            postData.featuredImage = result.url;
          }
        } catch (error) {
          console.error('Upload error:', error);
        }
      };
      
      input.click();
    }
    
    function handleSubmit() {
      errors.set({});
      
      // Validation
      if (!postData.title.trim()) {
        errors.update({ title: 'Tiêu đề là bắt buộc' });
        return false;
      }
      
      if (!postData.slug.trim()) {
        errors.update({ slug: 'Slug là bắt buộc' });
        return false;
      }
      
      if (!postData.content.trim() || postData.content === '<p><br></p>') {
        errors.update({ content: 'Nội dung là bắt buộc' });
        return false;
      }
      
      if (Object.keys($errors).length > 0) {
        return false;
      }
      
      $loading = true;
      return true;
    }
    
    function handleResult({ result }) {
      $loading = false;
      
      if (result.type === 'success') {
        goto('/admin/posts');
      } else if (result.type === 'failure') {
        errors.update(result.data?.errors || {});
        if (result.data?.message) {
          errors.update({ general: result.data.message });
        }
      }
    }
  </script>
</div>
