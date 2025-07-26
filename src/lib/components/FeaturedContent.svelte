<script>
  let { posts, loading } = $props();
</script>

<section class="space-y-8">
  {#if loading}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Main featured post skeleton -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
        <div class="w-full h-64 bg-gray-200 dark:bg-gray-700"></div>
        <div class="p-6">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
      
      <!-- Side posts skeletons -->
      {#each Array(4) as _}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div class="flex space-x-4">
            <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if posts.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-500 mb-4">
        <i class="fas fa-star text-4xl" aria-hidden="true"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Chưa có nội dung nổi bật
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        Hiện tại chưa có bài viết nổi bật nào
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Main Featured Post -->
      {#if posts[0]}
        <article class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
          <div class="relative">
            <img 
              src={posts[0].featuredImage || "/placeholder.svg"} 
              alt={posts[0].title}
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="eager"
            />
            <div class="absolute top-4 left-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                <i class="fas fa-star mr-1" aria-hidden="true"></i>
                Nổi bật
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              {#if posts[0].categories && posts[0].categories.length > 0}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {posts[0].categories[0].category.name}
                </span>
              {/if}
              <time 
                datetime={posts[0].publishedAt}
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                {new Date(posts[0].publishedAt).toLocaleDateString('vi-VN')}
              </time>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <a href="/tin-tuc/{posts[0].slug}">
                {posts[0].title}
              </a>
            </h2>
            
            {#if posts[0].excerpt}
              <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {posts[0].excerpt}
              </p>
            {/if}
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                {#if posts[0].author}
                  <div class="flex items-center">
                    <i class="fas fa-user mr-1" aria-hidden="true"></i>
                    <span>{posts[0].author.name}</span>
                  </div>
                {/if}
                {#if posts[0]._count?.comments}
                  <div class="flex items-center">
                    <i class="fas fa-comments mr-1" aria-hidden="true"></i>
                    <span>{posts[0]._count.comments}</span>
                  </div>
                {/if}
              </div>
              
              <a 
                href="/tin-tuc/{posts[0].slug}"
                class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
              >
                Đọc thêm
                <i class="fas fa-arrow-right ml-1" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </article>
      {/if}
      
      <!-- Side Featured Posts -->
      {#each posts.slice(1, 5) as post}
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 p-4 group">
          <div class="flex space-x-4">
            {#if post.featuredImage}
              <div class="flex-shrink-0">
                <img 
                  src={post.featuredImage || "/placeholder.svg"} 
                  alt={post.title}
                  class="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            {/if}
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                {#if post.categories && post.categories.length > 0}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {post.categories[0].category.name}
                  </span>
                {/if}
                <time 
                  datetime={post.publishedAt}
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                </time>
              </div>
              
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <a href="/tin-tuc/{post.slug}">
                  {post.title}
                </a>
              </h3>
              
              {#if post.excerpt}
                <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                  {post.excerpt}
                </p>
              {/if}
              
              <div class="flex items-center justify-between">
                {#if post.author}
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <i class="fas fa-user mr-1" aria-hidden="true"></i>
                    <span>{post.author.name}</span>
                  </div>
                {/if}
                
                <a 
                  href="/tin-tuc/{post.slug}"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium transition-colors"
                >
                  Đọc thêm
                </a>
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>
