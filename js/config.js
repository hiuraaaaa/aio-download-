// ============================================
// KONFIGURASI WEBSITE
// ============================================

const CONFIG = {
  // Informasi Website
  site: {
    name: "Nayone",
    fullName: "Nayone Downloader",
    tagline: "Free Tool",
    url: "nayone.my.id",
    description: "Download video dari berbagai platform - tanpa watermark, HD, atau audio MP3. Gratis, cepat, dan tanpa perlu login."
  },

  // Warna Theme
  colors: {
    primary: "#ff6b35",      // Orange utama
    secondary: "#ffe8df",    // Cream/Peach
    accent: "#ff8c5a",       // Orange terang
    dark: "#1a1a1a",         // Hitam
    text: "#2d2d2d",         // Text gelap
    textLight: "#666666",    // Text abu
    white: "#ffffff",
    border: "#e5e5e5",
    success: "#22c55e",
    warning: "#f59e0b"
  },

  // Platform Downloader
  platforms: [
    {
      id: "tiktok",
      name: "TikTok",
      icon: "tiktok",
      color: "#000000",
      active: true,
      featured: true,
      placeholder: "https://www.tiktok.com/@user/video/...",
      supportedDomains: ["tiktok.com", "vm.tiktok.com", "vt.tiktok.com"],
      formats: ["No WM", "HD", "Watermark", "MP3"],
      description: "Download video TikTok tanpa watermark, HD, atau audio MP3"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "instagram",
      color: "#E4405F",
      active: false,
      featured: true,
      placeholder: "https://www.instagram.com/p/...",
      supportedDomains: ["instagram.com"],
      formats: ["Video", "Story", "Reels", "IGTV"],
      description: "Download video, story, reels, dan IGTV Instagram"
    },
    {
      id: "mediafire",
      name: "MediaFire",
      icon: "mediafire",
      color: "#1299F3",
      active: true,
      featured: true,
      placeholder: "https://www.mediafire.com/file/...",
      supportedDomains: ["mediafire.com"],
      formats: ["Direct Download"],
      description: "Download file dari MediaFire dengan cepat"
    },
    {
      id: "twitter",
      name: "Twitter / X",
      icon: "twitter",
      color: "#000000",
      active: true,
      featured: true,
      placeholder: "https://twitter.com/user/status/...",
      supportedDomains: ["twitter.com", "x.com"],
      formats: ["Video", "GIF"],
      description: "Download video dan GIF dari Twitter/X"
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "facebook",
      color: "#1877F2",
      active: true,
      featured: true,
      placeholder: "https://www.facebook.com/watch/...",
      supportedDomains: ["facebook.com", "fb.watch"],
      formats: ["SD", "HD"],
      description: "Download video dari Facebook"
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "youtube",
      color: "#FF0000",
      active: true,
      featured: true,
      placeholder: "https://www.youtube.com/watch?v=...",
      supportedDomains: ["youtube.com", "youtu.be"],
      formats: ["Video", "MP3", "MP4"],
      description: "Download video atau audio dari YouTube"
    },
    {
      id: "pinterest",
      name: "Pinterest",
      icon: "pinterest",
      color: "#E60023",
      active: true,
      featured: false,
      placeholder: "https://www.pinterest.com/pin/...",
      supportedDomains: ["pinterest.com"],
      formats: ["Image", "Video"],
      description: "Download gambar dan video dari Pinterest"
    },
    {
      id: "snaptik",
      name: "SnapTik",
      icon: "snaptik",
      color: "#FFFC00",
      active: false,
      featured: false,
      comingSoon: true,
      description: "Segera hadir"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "linkedin",
      color: "#0A66C2",
      active: false,
      featured: false,
      comingSoon: true,
      description: "Segera hadir"
    },
    {
      id: "reddit",
      name: "Reddit",
      icon: "reddit",
      color: "#FF4500",
      active: false,
      featured: false,
      comingSoon: true,
      description: "Segera hadir"
    },
    {
      id: "vimeo",
      name: "Vimeo",
      icon: "vimeo",
      color: "#1AB7EA",
      active: false,
      featured: false,
      comingSoon: true,
      description: "Segera hadir"
    }
  ],

  // Fitur & Settings
  features: {
    autoFetch: true,           // Auto fetch saat paste URL
    showTutorial: true,        // Tampilkan cara penggunaan
    enableAnalytics: false,    // Google Analytics (opsional)
    maxUrlLength: 500,         // Max panjang URL
    apiTimeout: 30000          // Timeout API (ms)
  },

  // Teks Tutorial
  tutorial: [
    {
      step: 1,
      title: "Buka TikTok, tap <strong>Share</strong>, pilih <strong>Salin Tautan</strong>."
    },
    {
      step: 2,
      title: "Paste URL, klik <strong>Ambil Video</strong> atau tekan <kbd>Enter</kbd>."
    },
    {
      step: 3,
      title: "Pilih format: <strong>No WM</strong>, HD, Watermark, atau MP3."
    },
    {
      step: 4,
      title: "Tab baru terbuka → Klik kanan → <strong>Simpan Video Sebagai...</strong>"
    }
  ],

  // Social Media & Footer
  social: {
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourusername",
    telegram: "https://t.me/yourusername"
  },

  footer: {
    creator: "AnayaOffc",
    creatorUrl: "https://github.com/anayaoffc",
    year: new Date().getFullYear(),
    note: "Lapor ke developer jika error"
  },

  // API Endpoints
  api: {
    baseUrl: "https://www.kitsulabs.xyz/api/v1",
    endpoints: {
      tiktok: "/tiktok",
      instagram: "/instagram",  // Ganti jika ada endpoint lain
      youtube: "/youtube",      // Ganti jika ada endpoint lain
      twitter: "/twitter",      // Ganti jika ada endpoint lain
      facebook: "/facebook",    // Ganti jika ada endpoint lain
      mediafire: "/mediafire",  // Ganti jika ada endpoint lain
      pinterest: "/pinterest"   // Ganti jika ada endpoint lain
    }
  }
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
