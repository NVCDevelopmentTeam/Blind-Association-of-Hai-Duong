<script>
  const quickLinks = [
    {
      title: 'Đăng ký khóa học',
      description: 'Tham gia các khóa đào tạo nghề chuyên nghiệp',
      icon: 'fa-graduation-cap',
      href: '/dao-tao',
      color: 'bg-blue-500'
    },
    {
      title: 'Tìm việc làm',
      description: 'Khám phá cơ hội việc làm phù hợp',
      icon: 'fa-briefcase',
      href: '/viec-lam',
      color: 'bg-green-500'
    },
    {
      title: 'Dịch vụ hỗ trợ',
      description: 'Các dịch vụ phục hồi chức năng',
      icon: 'fa-hands-helping',
      href: '/ho-tro',
      color: 'bg-purple-500'
    },
    {
      title: 'Tư vấn trực tuyến',
      description: 'Nhận tư vấn từ chuyên gia',
      icon: 'fa-comments',
      href: '/lien-he',
      color: 'bg-orange-500'
    }
  ];
</script>

<section class="bg-gray-50 dark:bg-gray-800 py-16" aria-labelledby="quick-links-heading">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 id="quick-links-heading" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Dịch vụ nổi bật
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Khám phá các dịch vụ và chương trình hỗ trợ dành cho người khiếm thị
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each quickLinks as link}
        <a 
          href={link.href}
          class="group bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transform hover:-translate-y-1"
        >
          <div class="flex items-center justify-center w-12 h-12 {link.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
            <i class="fas {link.icon} text-white text-xl" aria-hidden="true"></i>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {link.title}
          </h3>
          
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {link.description}
          </p>
          
          <div class="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            Tìm hiểu thêm
            <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true"></i>
          </div>
        </a>
      {/each}
    </div>

    <!-- Statistics Section -->
    <div class="mt-16 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 p-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
          <div class="text-gray-600 dark:text-gray-400">Học viên đã tốt nghiệp</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
          <div class="text-gray-600 dark:text-gray-400">Tỷ lệ có việc làm</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15+</div>
          <div class="text-gray-600 dark:text-gray-400">Năm kinh nghiệm</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">20+</div>
          <div class="text-gray-600 dark:text-gray-400">Khóa đào tạo</div>
        </div>
      </div>
    </div>
  </div>
</section>
