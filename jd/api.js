/* ============================================
   API.JS - API Integration Example
   ============================================
   
   File ini adalah contoh implementasi API.
   Ganti dengan API downloader yang kamu punya!
*/

class NayoneAPI {
  constructor() {
    this.baseUrl = CONFIG.api.baseUrl;
    this.timeout = CONFIG.features.apiTimeout || 30000;
  }

  // Generic API call with GET method (Kitsulabs style)
  async call(endpoint, url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Encode URL parameter
      const encodedUrl = encodeURIComponent(url);
      const fullUrl = `${this.baseUrl}${endpoint}?url=${encodedUrl}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if API returned error
      if (!data.status) {
        throw new Error(data.message || 'Gagal mengambil data video');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server terlalu lama merespons');
      }
      
      throw error;
    }
  }

  // TikTok API - menggunakan Kitsulabs
  async tiktok(url) {
    return await this.call(CONFIG.api.endpoints.tiktok, url);
  }

  // Instagram API (belum ada endpoint, pakai mock)
  async instagram(url) {
    throw new Error('Instagram downloader belum tersedia. Silakan gunakan platform lain.');
  }

  // YouTube API (belum ada endpoint, pakai mock)
  async youtube(url) {
    throw new Error('YouTube downloader belum tersedia. Silakan gunakan platform lain.');
  }

  // Twitter API (belum ada endpoint, pakai mock)
  async twitter(url) {
    throw new Error('Twitter downloader belum tersedia. Silakan gunakan platform lain.');
  }

  // Facebook API (belum ada endpoint, pakai mock)
  async facebook(url) {
    throw new Error('Facebook downloader belum tersedia. Silakan gunakan platform lain.');
  }

  // MediaFire API (belum ada endpoint, pakai mock)
  async mediafire(url) {
    throw new Error('MediaFire downloader belum tersedia. Silakan gunakan platform lain.');
  }

  // Pinterest API (belum ada endpoint, pakai mock)
  async pinterest(url) {
    throw new Error('Pinterest downloader belum tersedia. Silakan gunakan platform lain.');
  }
}

// Export instance
const api = new NayoneAPI();

/* ============================================
   CONTOH RESPONSE FORMAT
   ============================================

   Response yang diharapkan dari API:

   {
     "status": "success",
     "data": {
       "title": "Video Title",
       "thumbnail": "https://...",
       "duration": "00:15",
       "author": "username",
       "downloads": [
         {
           "quality": "No WM",
           "url": "https://download-url.com/video.mp4",
           "size": "2.5 MB"
         },
         {
           "quality": "HD",
           "url": "https://download-url.com/video-hd.mp4",
           "size": "5.2 MB"
         },
         {
           "quality": "MP3",
           "url": "https://download-url.com/audio.mp3",
           "size": "1.2 MB"
         }
       ]
     }
   }

   Error response:
   {
     "status": "error",
     "message": "URL tidak valid atau video tidak ditemukan"
   }

   ============================================ */

/* ============================================
   ALTERNATIVE: Menggunakan API Pihak Ketiga
   ============================================

   Jika kamu tidak punya API sendiri, bisa pakai API gratis:
   
   1. RapidAPI TikTok Downloader
   2. TikTok API by SSSTik
   3. SnapTik API
   4. dll.

   Contoh dengan RapidAPI:

   async tiktok(url) {
     const response = await fetch('https://api.rapidapi.com/tiktok', {
       method: 'POST',
       headers: {
         'X-RapidAPI-Key': 'YOUR_API_KEY',
         'X-RapidAPI-Host': 'api-host.rapidapi.com',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ url })
     });
     
     return await response.json();
   }

   ============================================ */

/* ============================================
   TESTING WITHOUT API
   ============================================

   Untuk testing tanpa API, pakai mock data:
*/

class MockAPI {
  async call(endpoint, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response
    return {
      status: "success",
      data: {
        title: "Video Demo - " + data.url.split('/').pop(),
        thumbnail: "https://picsum.photos/400/300",
        duration: "00:15",
        author: "@username",
        downloads: [
          {
            quality: "No WM",
            url: "https://example.com/video.mp4",
            size: "2.5 MB"
          },
          {
            quality: "HD",
            url: "https://example.com/video-hd.mp4",
            size: "5.2 MB"
          },
          {
            quality: "Watermark",
            url: "https://example.com/video-wm.mp4",
            size: "2.1 MB"
          },
          {
            quality: "MP3",
            url: "https://example.com/audio.mp3",
            size: "1.2 MB"
          }
        ]
      }
    };
  }

  async tiktok(url) { return await this.call('/tiktok', { url }); }
  async instagram(url) { return await this.call('/instagram', { url }); }
  async youtube(url) { return await this.call('/youtube', { url }); }
  async twitter(url) { return await this.call('/twitter', { url }); }
  async facebook(url) { return await this.call('/facebook', { url }); }
  async mediafire(url) { return await this.call('/mediafire', { url }); }
  async pinterest(url) { return await this.call('/pinterest', { url }); }
}

// Comment/Uncomment untuk switch antara real API dan mock
// const api = new NayoneAPI(); // Real API
// const api = new MockAPI();    // Testing/Demo
