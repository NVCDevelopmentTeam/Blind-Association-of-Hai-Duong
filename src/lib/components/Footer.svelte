<script>
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	let currentYear = new Date().getFullYear();
	const settingsStore = writable({});
	let settings = $state();

	settingsStore.subscribe((value) => {
		settings = value;
	});

	onMount(async () => {
		if (!browser) return;

		try {
			const response = await fetch('http://localhost:3001/api/admin/settings');
			if (response.ok) {
				settingsStore.set(await response.json());
			}
		} catch (error) {
			console.error('Error fetching settings:', error);
		}
	});

	const footerLinks = {
		about: [
			{ name: 'Giới thiệu', href: '/gioi-thieu' },
			{ name: 'Sứ mệnh & Tầm nhìn', href: '/su-menh-tam-nhin' },
			{ name: 'Đội ngũ', href: '/doi-ngu' },
			{ name: 'Lịch sử', href: '/lich-su' }
		],
		services: [
			{ name: 'Phục hồi chức năng', href: '/phuc-hoi-chuc-nang' },
			{ name: 'Đào tạo nghề', href: '/dao-tao' },
			{ name: 'Tạo việc làm', href: '/viec-lam' },
			{ name: 'Hỗ trợ hòa nhập', href: '/ho-tro' }
		],
		resources: [
			{ name: 'Tài liệu', href: '/tai-lieu' },
			{ name: 'Video hướng dẫn', href: '/video' },
			{ name: 'Câu hỏi thường gặp', href: '/faq' },
			{ name: 'Tải xuống', href: '/tai-xuong' }
		],
		legal: [
			{ name: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
			{ name: 'Điều khoản sử dụng', href: '/dieu-khoan-su-dung' },
			{ name: 'Quy định', href: '/quy-dinh' },
			{ name: 'Liên hệ', href: '/lien-he' }
		]
	};

	const socialLinks = [
		{ name: 'Facebook', icon: 'fab fa-facebook-f', href: '#', color: 'hover:text-blue-600' },
		{ name: 'YouTube', icon: 'fab fa-youtube', href: '#', color: 'hover:text-red-600' },
		{ name: 'Twitter', icon: 'fab fa-twitter', href: '#', color: 'hover:text-blue-400' },
		{ name: 'LinkedIn', icon: 'fab fa-linkedin-in', href: '#', color: 'hover:text-blue-700' }
	];
</script>

<footer class="bg-gray-900 text-white" aria-labelledby="footer-heading">
	<!-- Main Footer -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			<!-- Organization Info -->
			<div class="lg:col-span-1">
				<div class="flex items-center space-x-3 mb-4">
					<div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
						<i class="fas fa-eye text-white text-xl" aria-hidden="true"></i>
					</div>
					<div>
						<h3 class="text-lg font-bold">TTPHCN Hải Dương</h3>
						<p class="text-sm text-gray-400">Trung tâm Phục hồi chức năng</p>
					</div>
				</div>

				<p class="text-gray-400 text-sm mb-4 leading-relaxed">
					{settings?.site_description ||
						'Nơi hỗ trợ, đào tạo và tạo việc làm cho người khiếm thị tại Hải Dương'}
				</p>

				<!-- Contact Info -->
				<div class="space-y-2 text-sm">
					<div class="flex items-center">
						<i class="fas fa-map-marker-alt text-blue-400 mr-3" aria-hidden="true"></i>
						<span class="text-gray-400">{settings?.address || 'Hải Dương, Việt Nam'}</span>
					</div>
					<div class="flex items-center">
						<i class="fas fa-phone text-blue-400 mr-3" aria-hidden="true"></i>
						<a
							href="tel:{settings?.contact_phone || '+84123456789'}"
							class="text-gray-400 hover:text-white transition-colors"
						>
							{settings?.contact_phone || '+84 123 456 789'}
						</a>
					</div>
					<div class="flex items-center">
						<i class="fas fa-envelope text-blue-400 mr-3" aria-hidden="true"></i>
						<a
							href="mailto:{settings?.contact_email || 'info@ttphcn-haiduong.vn'}"
							class="text-gray-400 hover:text-white transition-colors"
						>
							{settings?.contact_email || 'info@ttphcn-haiduong.vn'}
						</a>
					</div>
				</div>
			</div>

			<!-- About Links -->
			<div>
				<h4 class="text-lg font-semibold mb-4">Về chúng tôi</h4>
				<ul class="space-y-2">
					{#each footerLinks.about as link}
						<li>
							<a href={link.href} class="text-gray-400 hover:text-white transition-colors text-sm">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Services Links -->
			<div>
				<h4 class="text-lg font-semibold mb-4">Dịch vụ</h4>
				<ul class="space-y-2">
					{#each footerLinks.services as link}
						<li>
							<a href={link.href} class="text-gray-400 hover:text-white transition-colors text-sm">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources & Legal -->
			<div>
				<h4 class="text-lg font-semibold mb-4">Tài nguyên</h4>
				<ul class="space-y-2 mb-6">
					{#each footerLinks.resources as link}
						<li>
							<a href={link.href} class="text-gray-400 hover:text-white transition-colors text-sm">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>

				<h4 class="text-lg font-semibold mb-4">Pháp lý</h4>
				<ul class="space-y-2">
					{#each footerLinks.legal as link}
						<li>
							<a href={link.href} class="text-gray-400 hover:text-white transition-colors text-sm">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Newsletter Signup -->
		<div class="border-t border-gray-800 mt-12 pt-8">
			<div class="max-w-md mx-auto text-center">
				<h4 class="text-lg font-semibold mb-4">Đăng ký nhận tin</h4>
				<p class="text-gray-400 text-sm mb-4">
					Nhận thông tin mới nhất về các chương trình và hoạt động của trung tâm
				</p>
				<form class="flex flex-col sm:flex-row gap-3">
					<input
						type="email"
						placeholder="Nhập email của bạn"
						class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						required
					/>
					<button
						type="submit"
						class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
					>
						Đăng ký
					</button>
				</form>
			</div>
		</div>
	</div>

	<!-- Bottom Footer -->
	<div class="border-t border-gray-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<!-- Copyright -->
				<div class="text-gray-400 text-sm mb-4 md:mb-0">
					<p>
						© {currentYear}
						{settings?.site_name || 'Trung tâm Phục hồi chức năng Hải Dương'}. Tất cả quyền được bảo
						lưu.
					</p>
				</div>

				<!-- Social Links -->
				<div class="flex items-center space-x-4">
					<span class="text-gray-400 text-sm mr-2">Theo dõi chúng tôi:</span>
					{#each socialLinks as social}
						<a
							href={social.href}
							class="text-gray-400 {social.color} transition-colors p-2 rounded-full hover:bg-gray-800"
							aria-label={social.name}
							target="_blank"
							rel="noopener noreferrer"
						>
							<i class={social.icon} aria-hidden="true"></i>
						</a>
					{/each}
				</div>
			</div>

			<!-- Accessibility Statement -->
			<div class="mt-4 pt-4 border-t border-gray-800 text-center">
				<p class="text-gray-400 text-xs">
					Website này được thiết kế tuân thủ các tiêu chuẩn truy cập web WCAG 2.1 AA để đảm bảo khả
					năng tiếp cận tốt nhất cho người khiếm thị.
					<a href="/kha-nang-tiep-can" class="text-blue-400 hover:text-blue-300 underline ml-1">
						Tìm hiểu thêm về khả năng tiếp cận
					</a>
				</p>
			</div>
		</div>
	</div>
</footer>
