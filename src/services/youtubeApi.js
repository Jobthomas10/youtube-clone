import axios from 'axios';

// Get configuration from environment variables
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const API_BASE_URL = import.meta.env.VITE_YOUTUBE_API_BASE_URL || 'https://youtube-v31.p.rapidapi.com';
const API_TYPE = import.meta.env.VITE_YOUTUBE_API_TYPE || 'rapidapi'; // 'rapidapi' or 'google'
const RAPIDAPI_HOST = import.meta.env.VITE_YOUTUBE_API_HOST || 'youtube-v31.p.rapidapi.com';

// Mock Data for Fallback (to guarantee the app works without keys or if API limits are hit)
const MOCK_VIDEOS = [
  {
    id: { videoId: 'dQw4w9WgXcQ' },
    snippet: {
      title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
      description: 'The official video for Never Gonna Give You Up by Rick Astley. Subscribe to the official Rick Astley YouTube channel.',
      thumbnails: {
        medium: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg' },
        high: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' }
      },
      channelId: 'UCuAXFkgsw1L7xaCfQ5JUFmQ',
      channelTitle: 'Rick Astley',
      publishedAt: '2009-10-25T06:57:33Z'
    },
    statistics: {
      viewCount: '1452901284',
      likeCount: '17281902'
    }
  },
  {
    id: { videoId: '9bZkp7q19f0' },
    snippet: {
      title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
      description: 'PSY - GANGNAM STYLE(강남스타일) M/V. The official music video of Gangnam Style.',
      thumbnails: {
        medium: { url: 'https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg' },
        high: { url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg' }
      },
      channelId: 'UC1ovrV4M1Lfd-yJA21ysj1g',
      channelTitle: 'officialpsy',
      publishedAt: '2012-07-15T07:46:32Z'
    },
    statistics: {
      viewCount: '5129304910',
      likeCount: '28102941'
    }
  },
  {
    id: { videoId: 'kJQP7kiw5Fk' },
    snippet: {
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      description: 'Despacito available on all digital platforms. Stream/Download now!',
      thumbnails: {
        medium: { url: 'https://img.youtube.com/vi/kJQP7kiw5Fk/mqdefault.jpg' },
        high: { url: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg' }
      },
      channelId: 'UC9T4ui_3N430KWMa11n543A',
      channelTitle: 'LuisFonsiVEVO',
      publishedAt: '2017-01-13T05:00:02Z'
    },
    statistics: {
      viewCount: '8401928401',
      likeCount: '52910394'
    }
  },
  {
    id: { videoId: 'ScMzIvxBSi4' },
    snippet: {
      title: 'Building a React App with Material UI - A Comprehensive Tutorial',
      description: 'Learn how to build beautiful, responsive, and functional React applications using Material UI v5. We will cover buttons, cards, grid layouts, and light/dark theme toggle.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60' },
        high: { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'UCc7G81c7g4NfK4Z-6n0V51A',
      channelTitle: 'TechAcademy',
      publishedAt: '2025-05-10T12:00:00Z'
    },
    statistics: {
      viewCount: '124050',
      likeCount: '6540'
    }
  },
  {
    id: { videoId: 't2plhgE6f2Q' },
    snippet: {
      title: 'Gaming in 2026: The Next-Gen Unreal Engine 5.5 Showcase',
      description: 'Take an exclusive look at the upcoming games powered by Unreal Engine 5.5. Real-time lighting, high-fidelity geometry, and photorealistic physics in action.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60' },
        high: { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'UCgB3kLhG6A9Q5fR1T2A3B4C',
      channelTitle: 'GamerHQ',
      publishedAt: '2026-02-18T16:45:00Z'
    },
    statistics: {
      viewCount: '895600',
      likeCount: '45300'
    }
  },
  {
    id: { videoId: 'l1dY_0dJ8Uo' },
    snippet: {
      title: 'The Future of AI: Introducing Next-Gen Neural Networks',
      description: 'Explore the capabilities of the latest artificial intelligence models. How deep learning, reinforcement learning, and transformers are changing coding, art, and science.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60' },
        high: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'UCaC1D2E3F4G5H6I7J8K9L0M',
      channelTitle: 'FutureTech',
      publishedAt: '2026-04-01T08:30:00Z'
    },
    statistics: {
      viewCount: '345200',
      likeCount: '19000'
    }
  },
  {
    id: { videoId: 'aB3CD4EF5GH' },
    snippet: {
      title: 'UEFA Champions League 2026 - Best Goals of the Season',
      description: 'Watch the most sensational goals scored during the 2025/2026 UEFA Champions League season. Incredible strikes, headers, and team plays.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60' },
        high: { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'UCuH1I2J3K4L5M6N7O8P9Q0R',
      channelTitle: 'SportsNetwork',
      publishedAt: '2026-05-30T21:00:00Z'
    },
    statistics: {
      viewCount: '2540000',
      likeCount: '128000'
    }
  },
  {
    id: { videoId: 'iJ8K9L0M1N2' },
    snippet: {
      title: 'SpaceX Starship Orbital Launch Update - Mars Mission prep',
      description: 'SpaceX is preparing for its next orbital flight test. Let\'s dive into the telemetry, upgrade details, and the timeline for the Mars test missions.',
      thumbnails: {
        medium: { url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&auto=format&fit=crop&q=60' },
        high: { url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&auto=format&fit=crop&q=80' }
      },
      channelId: 'UCvW1X2Y3Z4A5B6C7D8E9F0G',
      channelTitle: 'CosmosExplored',
      publishedAt: '2026-06-12T14:10:00Z'
    },
    statistics: {
      viewCount: '1205300',
      likeCount: '98400'
    }
  }
];

// Axios client configuration
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Perform a request to the YouTube API, with auto-fallback to mock data if there are errors or missing keys.
 * @param {string} endpoint 
 * @param {object} params 
 * @returns {Promise<any>}
 */
export const fetchFromApi = async (endpoint, params = {}) => {
  // If no API key is specified, log warning and use fallback mock data
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.warn('[YouTube API Service] No valid API Key configured in .env. Returning Mock Fallback Data.');
    return getMockFallback(endpoint, params);
  }

  try {
    let response;

    if (API_TYPE === 'google' || API_BASE_URL.includes('googleapis.com')) {
      // Setup Google API request
      const googleBaseUrl = 'https://www.googleapis.com/youtube/v3';
      const fullUrl = `${googleBaseUrl}/${endpoint}`;
      
      response = await axios.get(fullUrl, {
        params: {
          key: API_KEY,
          ...params,
        },
      });
    } else {
      // Setup RapidAPI request
      response = await axiosClient.get(`/${endpoint}`, {
        params: params,
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      });
    }

    return response.data;
  } catch (error) {
    console.error(`[YouTube API Service] API Call failed for endpoint "${endpoint}":`, error.message);
    console.warn('[YouTube API Service] Falling back to Mock Data.');
    return getMockFallback(endpoint, params);
  }
};

/**
 * Resolves API requests using realistic Mock Data
 */
const getMockFallback = (endpoint, params) => {
  return new Promise((resolve) => {
    // Simulate minor network delay for realistic visual skeleton behavior
    setTimeout(() => {
      if (endpoint === 'search') {
        const query = (params.q || '').toLowerCase().trim();
        
        // Simple search filtering
        let filteredVideos = [];
        if (query && query !== 'new' && query !== 'all') {
          // Split search query into individual words for flexible matching
          const queryWords = query.split(/\s+/).filter(Boolean);
          
          filteredVideos = MOCK_VIDEOS.filter(video => {
            const title = (video.snippet?.title || '').toLowerCase();
            const description = (video.snippet?.description || '').toLowerCase();
            const channelTitle = (video.snippet?.channelTitle || '').toLowerCase();
            
            // Match if all search terms are present in either title, description, or channel
            return queryWords.every(word => 
              title.includes(word) || 
              description.includes(word) || 
              channelTitle.includes(word)
            );
          });
        } else {
          // Return all mock videos for 'new' / 'all' or empty queries
          filteredVideos = MOCK_VIDEOS;
        }

        resolve({ items: filteredVideos });
      } 
      else if (endpoint === 'videos') {
        if (params.id) {
          // Fetch specific video detail
          const ids = params.id.split(',');
          const matched = MOCK_VIDEOS.filter(video => ids.includes(video.id.videoId || video.id));
          resolve({ items: matched.length > 0 ? matched : [MOCK_VIDEOS[0]] });
        } else {
          // Feed / Most Popular
          resolve({ items: MOCK_VIDEOS });
        }
      } 
      else if (endpoint === 'channels') {
        resolve({
          items: [
            {
              id: params.id || 'UCuAXFkgsw1L7xaCfQ5JUFmQ',
              snippet: {
                title: 'Official Channel',
                thumbnails: {
                  default: { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
                }
              },
              statistics: {
                subscriberCount: '15400000'
              }
            }
          ]
        });
      } 
      else {
        // Fallback catch-all
        resolve({ items: MOCK_VIDEOS });
      }
    }, 600);
  });
};
