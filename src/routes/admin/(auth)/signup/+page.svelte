<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  let form = $state();
  let loading = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let agreeToTerms = $state(false);
  let errors = $state({});
  let step = $state(1); // 1: signup form, 2: OTP verification
  let otpCode = $state('');
  let otpTimer = $state(300); // 5 minutes
  let timerInterval;
  
  // Form validation
  function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username) && username.length >= 3;
  }
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      valid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    };
  }
  
  function handleSubmit() {
    errors = {};
    
    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate username
    if (!username) {
      errors.username = 'Tên đăng nhập là bắt buộc';
    } else if (!validateUsername(username)) {
      errors.username = 'Tên đăng nhập chỉ được chứa chữ cái và số, ít nhất 3 ký tự';
    }
    
    // Validate email
    if (!email) {
      errors.email = 'Email là bắt buộc';
    } else if (!validateEmail(email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    // Validate password
    if (!password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        errors.password = 'Mật khẩu không đáp ứng yêu cầu bảo mật';
      }
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    // Validate terms agreement
    if (!agreeToTerms) {
      errors.terms = 'Bạn phải đồng ý với điều khoản và chính sách bảo mật';
    }
    
    if (Object.keys(errors).length > 0) {
      return false;
    }
    
    loading = true;
    return true;
  }
  
  function startOtpTimer() {
    timerInterval = setInterval(() => {
      otpTimer--;
      if (otpTimer <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  function handleResult({ result }) {
    loading = false;
    
    if (result.type === 'success') {
      if (result.data?.step === 'otp') {
        step = 2;
        startOtpTimer();
      } else {
        goto('/admin/login');
      }
    } else if (result.type === 'failure') {
      errors.general = result.data?.message || 'Đăng ký thất bại';
    }
  }
</script>

<div class="bg-white shadow-xl rounded-lg px-8 py-10">
  {#if step === 1}
    <!-- Signup Form -->
    <form 
      bind:this={form}
      method="POST" 
      action="?/signup"
      use:enhance={({ formData, cancel }) => {
        if (!handleSubmit()) {
          cancel();
          return;
        }
        return handleResult;
      }}
      class="space-y-6"
      novalidate
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Đăng ký tài khoản</h2>
      </div>

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          Tên đăng nhập *
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          class:border-red-500={errors.username}
          placeholder="Chỉ chữ cái và số, ít nhất 3 ký tự"
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {#if errors.username}
          <p id="username-error" class="mt-1 text-sm text-red-600" role="alert">
            {errors.username}
          </p>
        {/if}
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          class:border-red-500={errors.email}
          placeholder="example@email.com"
        />
        {#if errors.email}
          <p class="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
        {/if}
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu *
        </label>
        <div class="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            class="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            class:border-red-500={errors.password}
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            <i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400"></i>
          </button>
        </div>
        {#if errors.password}
          <p class="mt-1 text-sm text-red-600" role="alert">{errors.password}</p>
        {/if}
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
          Xác nhận mật khẩu *
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            class="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            class:border-red-500={errors.confirmPassword}
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            onclick={() => showConfirmPassword = !showConfirmPassword}
            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            <i class="fas {showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400"></i>
          </button>
        </div>
        {#if errors.confirmPassword}
          <p class="mt-1 text-sm text-red-600" role="alert">{errors.confirmPassword}</p>
        {/if}
      </div>

      <div class="flex items-start">
        <input
          id="agree-terms"
          name="agree-terms"
          type="checkbox"
          bind:checked={agreeToTerms}
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          class:border-red-500={errors.terms}
        />
        <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
          Tôi đồng ý với 
          <a href="/privacy-policy" class="text-blue-600 hover:text-blue-500" target="_blank">
            Chính sách bảo mật
          </a> 
          và 
          <a href="/terms-of-service" class="text-blue-600 hover:text-blue-500" target="_blank">
            Điều khoản sử dụng
          </a>
        </label>
      </div>
      {#if errors.terms}
        <p class="text-sm text-red-600" role="alert">{errors.terms}</p>
      {/if}

      {#if errors.general}
        <div class="bg-red-50 border border-red-200 rounded-md p-3" role="alert">
          <p class="text-sm text-red-600">{errors.general}</p>
        </div>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <i class="fas fa-spinner fa-spin mr-2"></i>
          Đang đăng ký...
        {:else}
          Đăng ký
        {/if}
      </button>
    </form>
  {:else}
    <!-- OTP Verification -->
    <form 
      method="POST" 
      action="?/verify-otp"
      use:enhance={handleResult}
      class="space-y-6"
    >
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Xác thực OTP</h2>
        <p class="text-gray-600 mb-6">
          Chúng tôi đã gửi mã OTP 6 chữ số đến email của bạn. 
          Vui lòng nhập mã để hoàn tất đăng ký.
        </p>
      </div>

      <div>
        <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
          Mã OTP *
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          maxlength="6"
          bind:value={otpCode}
          class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
          placeholder="000000"
          required
        />
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Mã sẽ hết hạn sau: <span class="font-mono font-bold text-red-600">{formatTime(otpTimer)}</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || otpCode.length !== 6}
        class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if loading}
          <i class="fas fa-spinner fa-spin mr-2"></i>
          Đang xác thực...
        {:else}
          Xác thực OTP
        {/if}
      </button>

      <div class="text-center">
        <button
          type="button"
          disabled={otpTimer > 0}
          class="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          onclick={() => {
            // Resend OTP logic here
            otpTimer = 300;
            startOtpTimer();
          }}
        >
          {otpTimer > 0 ? 'Gửi lại OTP' : 'Gửi lại OTP'}
        </button>
      </div>
    </form>
  {/if}
</div>
