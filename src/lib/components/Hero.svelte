<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let currentSlide = $state(0);
  let autoplayInterval;

  const slides = [
    {
      id: 1,
      title: 'Trung tâm Phục hồi chức năng Hải Dương',
      subtitle: 'Nơi khởi đầu cho tương lai tươi sáng',
      description: 'Chúng tôi cam kết mang đến những dịch vụ phục hồi chức năng và đào tạo nghề chất lượng cao cho người khiếm thị',
      image: '/placeholder.svg?height=600&width=1200',
      cta: {
        primary: { text: 'Tìm hiểu thêm', href: '/gioi-thieu' },
        secondary: { text: 'Liên hệ ngay', href: '/lien-he' }
      }
    },
    {
      id: 2,
      title: 'Đào tạo nghề chuyên nghiệp',
      subtitle: 'Kỹ năng thực tế - Cơ hội việc làm',
      description: 'Các khóa đào tạo CNTT, massage, thủ công mỹ nghệ được thiết kế phù hợp với người khiếm thị',
      image: '/placeholder.svg?height=600&width=1200',
      cta: {
        primary: { text: 'Xem khóa học', href: '/dao-tao' },
        secondary: { text: 'Đăng ký ngay', href: '/lien-he' }
      }
    },
    {
      id: 3,
      title: 'Hỗ trợ việc làm',
      subtitle: 'Kết nối cơ hội - Xây dựng tương lai',
      description: 'Chương trình hỗ trợ tìm việc làm và tạo sinh kế bền vững cho người khiếm thị',
      image: '/placeholder.svg?height=600&width=1200',
      cta: {
        primary: { text: 'Tìm việc làm', href: '/viec-lam' },
        secondary: { text: 'Hỗ trợ tư vấn', href: '/lien-he' }
      }
    }
  ];

  onMount(() => {
    if (browser) {
      // Auto-play slides
      autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
      }, 5000);

      return () => {
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
        }
      };
    }
  });

  function goToSlide(index) {
    currentSlide = index;
    // Reset autoplay
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
      }, 5000);
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }

  function prevSlide() {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  }
</script>

<section class="relative bg-gray-900 overflow-hidden" aria-label="Hero banner">
  <!-- Background Images -->
  {#each slides as slide, index}
    <div 
      class="absolute inset-0 transition-opacity duration-1000 {index === currentSlide ? 'opacity-100' : 'opacity-0'}"
      aria-hidden={index !== currentSlide}
    >
      <img 
        src={slide.image || "/placeholder.svg"} 
        alt={slide.title}
        class="w-full h-full object-cover"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
  {/each}

  <!-- Content -->
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
    <div class="text-center lg:text-left lg:max-w-2xl">
      {#each slides as slide, index}
        <div 
          class="transition-all duration-500 {index === currentSlide ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 absolute'}"
          aria-hidden={index !== currentSlide}
        >
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {slide.title}
          </h1>
          <p class="text-xl lg:text-2xl text-blue-200 mb-6 font-medium">
            {slide.subtitle}
          </p>
          <p class="text-lg text-gray-300 mb-8 leading-relaxed">
            {slide.description}
          </p>
          
          <!-- Call to Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a 
              href={slide.cta.primary.href}
              class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {slide.cta.primary.text}
              <i class="fas fa-arrow-right ml-2" aria-hidden="true"></i>
            </a>
            <a 
              href={slide.cta.secondary.href}
              class="inline-flex items-center justify-center px-8 py-4 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {slide.cta.secondary.text}
              <i class="fas fa-phone ml-2" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Navigation Controls -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <div class="flex space-x-2">
      {#each slides as _, index}
        <button 
          onclick={() => goToSlide(index)}
          class="w-3 h-3 rounded-full transition-colors {index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}"
          aria-label="Chuyển đến slide {index + 1}"
        ></button>
      {/each}
    </div>
  </div>

  <!-- Previous/Next Buttons -->
  <button 
    onclick={prevSlide}
    class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
    aria-label="Slide trước"
  >
    <i class="fas fa-chevron-left" aria-hidden="true"></i>
  </button>
  
  <button 
    onclick={nextSlide}
    class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
    aria-label="Slide tiếp theo"
  >
    <i class="fas fa-chevron-right" aria-hidden="true"></i>
  </button>

  <!-- Accessibility: Screen reader content -->
  <div class="sr-only">
    <p>Đang hiển thị slide {currentSlide + 1} trong tổng số {slides.length} slides</p>
  </div>
</section>
