// ============================================
// APP.JS - Main Application Logic
// ============================================

class NayoneApp {
  constructor() {
    this.currentPlatform = 'tiktok';
    this.isSidebarOpen = false;
    this.isLoading = false;
    this.init();
  }

  init() {
    this.renderPlatforms();
    this.bindEvents();
    this.loadCurrentPlatform();
    console.log('Nayone App initialized!');
  }

  // Render platform list di sidebar
  renderPlatforms() {
    const downloaderList = document.getElementById('downloaderList');
    const othersList = document.getElementById('othersList');
    
    if (!downloaderList || !othersList) return;

    // Clear existing
    downloaderList.innerHTML = '';
    othersList.innerHTML = '';

    CONFIG.platforms.forEach(platform => {
      const item = this.createPlatformItem(platform);
      
      if (platform.featured) {
        downloaderList.appendChild(item);
      } else {
        othersList.appendChild(item);
      }
    });
  }

  // Create platform item HTML
  createPlatformItem(platform) {
    const item = document.createElement('div');
    item.className = `platform-item ${platform.active ? '' : 'disabled'} ${this.currentPlatform === platform.id ? 'active' : ''}`;
    item.dataset.platform = platform.id;

    const statusBadge = platform.comingSoon 
      ? '<span class="soon-badge">SOON</span>' 
      : '';

    item.innerHTML = `
      <div class="platform-icon" style="background-color: ${platform.color}">
        <i class="icon-${platform.icon}"></i>
      </div>
      <span class="platform-name">${platform.name}</span>
      ${statusBadge}
    `;

    if (platform.active) {
      item.addEventListener('click', () => this.switchPlatform(platform.id));
    }

    return item;
  }

  // Switch platform
  switchPlatform(platformId) {
    this.currentPlatform = platformId;
    this.loadCurrentPlatform();
    this.updateActivePlatform();
    this.closeSidebar();
  }

  // Load platform info
  loadCurrentPlatform() {
    const platform = CONFIG.platforms.find(p => p.id === this.currentPlatform);
    if (!platform) return;

    // Update page title
    const titleElement = document.querySelector('.platform-title');
    if (titleElement) {
      titleElement.innerHTML = `<i class="icon-${platform.icon}"></i> Nayone ${platform.name} Downloader`;
    }

    // Update input placeholder
    const urlInput = document.getElementById('urlInput');
    if (urlInput && platform.placeholder) {
      urlInput.placeholder = platform.placeholder;
    }

    // Update main title
    const mainTitle = document.querySelector('.hero-title');
    if (mainTitle) {
      mainTitle.innerHTML = `Download Video <span class="highlight">${platform.name}</span><br>Tanpa Watermark`;
    }

    // Update description
    const description = document.querySelector('.hero-description');
    if (description) {
      description.textContent = platform.description || CONFIG.site.description;
    }

    // Update supported domains
    this.updateSupportedDomains(platform.supportedDomains || []);
  }

  // Update supported domains display
  updateSupportedDomains(domains) {
    const container = document.querySelector('.supported-domains');
    if (!container) return;

    container.innerHTML = domains.map(domain => 
      `<span class="domain-tag">${domain}</span>`
    ).join('');
  }

  // Update active platform in sidebar
  updateActivePlatform() {
    document.querySelectorAll('.platform-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.platform === this.currentPlatform) {
        item.classList.add('active');
      }
    });
  }

  // Bind all events
  bindEvents() {
    // Sidebar toggle
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.toggleSidebar());
    }

    if (overlay) {
      overlay.addEventListener('click', () => this.closeSidebar());
    }

    // URL Input
    const urlInput = document.getElementById('urlInput');
    const downloadBtn = document.getElementById('downloadBtn');

    if (urlInput) {
      // Auto fetch on paste
      urlInput.addEventListener('paste', (e) => {
        if (CONFIG.features.autoFetch) {
          setTimeout(() => this.handleDownload(), 100);
        }
      });

      // Enter key
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleDownload();
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.handleDownload());
    }
  }

  // Toggle sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (sidebar) {
      sidebar.classList.toggle('open', this.isSidebarOpen);
    }
    if (overlay) {
      overlay.classList.toggle('show', this.isSidebarOpen);
    }

    // Prevent body scroll when sidebar open
    document.body.style.overflow = this.isSidebarOpen ? 'hidden' : '';
  }

  // Close sidebar
  closeSidebar() {
    this.isSidebarOpen = false;
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (sidebar) {
      sidebar.classList.remove('open');
    }
    if (overlay) {
      overlay.classList.remove('show');
    }

    document.body.style.overflow = '';
  }

  // Handle download
  async handleDownload() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput?.value.trim();

    if (!url) {
      this.showNotification('error', 'Masukkan URL terlebih dahulu!');
      return;
    }

    if (!this.validateUrl(url)) {
      this.showNotification('error', 'URL tidak valid atau tidak didukung!');
      return;
    }

    // Set loading state
    this.setLoading(true);

    try {
      const response = await this.fetchVideoData(url);
      
      if (response.status === 'error') {
        throw new Error(response.message || 'Gagal mengambil data video');
      }
      
      this.showNotification('success', 'Video berhasil diambil!');
      this.displayResults(response);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('resultsContainer')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 300);
    } catch (error) {
      this.showNotification('error', error.message || 'Terjadi kesalahan!');
      console.error('Download error:', error);
    } finally {
      this.setLoading(false);
    }
  }

  // Validate URL
  validateUrl(url) {
    const platform = CONFIG.platforms.find(p => p.id === this.currentPlatform);
    if (!platform || !platform.supportedDomains) return false;

    return platform.supportedDomains.some(domain => url.includes(domain));
  }

  // Fetch video data from API
  async fetchVideoData(url) {
    try {
      const apiMethod = api[this.currentPlatform];
      if (!apiMethod) {
        throw new Error('Platform belum didukung');
      }
      
      const response = await apiMethod.call(api, url);
      
      if (!response.status) {
        throw new Error(response.message || 'Gagal mengambil data video');
      }

      // Transform API response to our format
      return this.transformApiResponse(response);
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil data video');
    }
  }

  // Transform Kitsulabs API response to our format
  transformApiResponse(response) {
    const { type, result } = response;

    // Base data
    const baseData = {
      id: result.id,
      title: result.title,
      thumbnail: type === 'video' ? result.thumbnail : result.slides[0],
      author: result.music?.author || 'Unknown',
      type: type
    };

    // Handle video type
    if (type === 'video') {
      baseData.downloads = [
        {
          quality: 'HD',
          url: result.video_hd,
          size: 'HD Quality',
          type: 'video'
        },
        {
          quality: 'SD',
          url: result.video_sd,
          size: 'SD Quality',
          type: 'video'
        },
        {
          quality: 'Audio',
          url: result.music?.url || '#',
          size: `${result.music?.duration}s`,
          type: 'audio'
        }
      ];
      
      baseData.stats = result.stats;
      baseData.duration = `${result.duration}s`;
    }
    // Handle slide type (foto geser)
    else if (type === 'slide') {
      baseData.downloads = result.slides.map((slide, index) => ({
        quality: `Foto ${index + 1}`,
        url: slide,
        size: 'Image',
        type: 'image'
      }));
      
      // Add audio download if available
      if (result.music?.url) {
        baseData.downloads.push({
          quality: 'Audio',
          url: result.music.url,
          size: 'MP3',
          type: 'audio'
        });
      }
      
      baseData.totalSlides = result.total_slides;
    }

    return {
      status: 'success',
      data: baseData
    };
  }

  // Display results
  displayResults(data) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;

    const videoData = data.data || data;
    const isSlide = videoData.type === 'slide';

    // Build stats HTML if available
    let statsHtml = '';
    if (videoData.stats) {
      statsHtml = `
        <div class="video-stats">
          <span><i class="fas fa-eye"></i> ${this.formatNumber(videoData.stats.views)}</span>
          <span><i class="fas fa-heart"></i> ${this.formatNumber(videoData.stats.likes)}</span>
          <span><i class="fas fa-comment"></i> ${this.formatNumber(videoData.stats.comments)}</span>
          <span><i class="fas fa-share"></i> ${this.formatNumber(videoData.stats.shares)}</span>
        </div>
      `;
    }

    // Build slide info if it's a slide
    let slideInfo = '';
    if (isSlide && videoData.totalSlides) {
      slideInfo = `<span class="slide-badge"><i class="fas fa-images"></i> ${videoData.totalSlides} Foto</span>`;
    }

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <div class="result-card animate-in">
        <div class="result-thumbnail">
          <img src="${videoData.thumbnail}" alt="${videoData.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
          ${videoData.duration ? `<span class="video-duration">${videoData.duration}</span>` : ''}
          ${slideInfo}
        </div>
        <div class="result-info">
          <h3 class="result-title">${videoData.title}</h3>
          ${videoData.author ? `<p class="result-author"><i class="fas fa-user"></i> ${videoData.author}</p>` : ''}
          ${statsHtml}
          <div class="result-actions">
            ${videoData.downloads.map((dl, index) => {
              const icon = dl.type === 'audio' ? 'fa-music' : (dl.type === 'image' ? 'fa-image' : 'fa-download');
              return `
                <a href="${dl.url}" target="_blank" class="btn-format" data-quality="${dl.quality}" ${dl.url === '#' ? 'style="opacity:0.5;pointer-events:none;"' : ''}>
                  <div class="format-info">
                    <span class="format-quality">${dl.quality}</span>
                    <span class="format-size">${dl.size}</span>
                  </div>
                  <i class="fas ${icon}"></i>
                </a>
              `;
            }).join('')}
          </div>
          ${isSlide ? '<p class="download-hint"><i class="fas fa-info-circle"></i> Klik foto untuk download</p>' : '<p class="download-hint"><i class="fas fa-info-circle"></i> Video akan terbuka di tab baru. Klik kanan > Save Video</p>'}
        </div>
      </div>
    `;
  }

  // Format number with K, M suffix
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Set loading state
  setLoading(loading) {
    this.isLoading = loading;
    const downloadBtn = document.getElementById('downloadBtn');
    const urlInput = document.getElementById('urlInput');

    if (downloadBtn) {
      downloadBtn.disabled = loading;
      downloadBtn.innerHTML = loading 
        ? '<i class="icon-loading"></i> Loading...' 
        : '<i class="icon-download"></i> Ambil Video';
    }

    if (urlInput) {
      urlInput.disabled = loading;
    }
  }

  // Show notification
  showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new NayoneApp();
});
