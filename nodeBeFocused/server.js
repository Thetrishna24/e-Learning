const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const API_KEY = 'AIzaSyDFKB5JicyHNbWBqvCAHoDdNJ-irzc1xSo';

app.set('view engine', 'ejs');
app.use(express.static('public'));

const quotes = [
  "Focus on the process, not the outcome.",
  "The key to success is to focus on goals, not obstacles.",
  "Stay focused and never give up.",
  "Your focus determines your reality.",
  "Concentrate all your thoughts upon the work at hand.",
  "Success demands singleness of purpose.",
  "The more you focus, the more you achieve."
];

const courseSections = [
  {
    title: 'Featured Courses',
    courses: [
      { id: 'PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w', title: 'Python Mastery' },
      { id: 'PL49CF3715CB9EF31D', title: 'JavaScript Essentials' },
      { id: 'PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA', title: 'Full-Stack Web Development' },
    ]
  },
  {
    title: 'Programming Basics',
    courses: [
      { id: 'PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3', title: 'Python for beginners' },
      { id: 'PLoYCgNOIyGACTDHuZtn0qoBdpzV9c327V', title: 'JavaScript Essentials' },
      { id: 'PL9ooVrP1hQOEloRCBI97ZXkWUg6MJn0Yf', title: 'Full-Stack Web Development' },
      { id: 'PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt', title: 'Python for beginners' },
      { id: 'PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5', title: 'JavaScript Essentials' },
      { id: 'PL98qAXLA6aftD9ZlnjpLhdQAOFI8xIB6e', title: 'Full-Stack Web Development' },
    ]
  },
  {
    title: 'Competitive Programming',
    courses: [
      { id: 'PLyqSpQzTE6M9p9pKxFGpskf4voY45T2DZ', title: 'Python for beginners' },
      { id: 'PLpO3gASfJEIJZqTAEQnLeYyz_vaNWLfHS', title: 'JavaScript Essentials' },
      { id: 'PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY', title: 'Full-Stack Web Development' },
      { id: 'PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P', title: 'Python for beginners' },
      { id: 'PLSIpQf0NbcCltzNFrOJkQ4J4AAjW3TSmA', title: 'JavaScript Essentials' },
      { id: 'PLmM0bg5v6gKFMhJ9vn2MwxVm2TUNU42VU', title: 'Full-Stack Web Development' },
    ]
  },
  {
    title: 'Database Management',
    courses: [
      { id: 'PLxCzCOWd7aiHqU4HKL7-SITyuSIcD93id', title: 'Python for beginners' },
      { id: 'PL0b6OzIxLPbzf12lu5etX_vjN-eUxgxnr', title: 'JavaScript Essentials' },
      { id: 'PLLAZ4kZ9dFpOFJ9JcVW9u4PlSWO-VFoao', title: 'Full-Stack Web Development' },
      { id: 'PLLGlmW7jT-nTr1ory9o2MgsOmmx2w8FB3', title: 'Python for beginners' },
      { id: 'PLwvrYc43l1MxAEOI_KwGe8l42uJxMoKeS', title: 'Python for beginners' },
      { id: 'PL3bGLnkkGnuUOB9YjjVDty6aCJApvkw8O', title: 'Python for beginners' },
    ]
  },
  {
    title: 'Coding Interview Preparation',
    courses: [
      { id: 'PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', title: 'Python for beginners' },
      { id: 'PLX6IKgS15Ue02WDPRCmYKuZicQHit9kFt', title: 'JavaScript Essentials' },
      { id: 'PLGLfVvz_LVvS5P7khyR4xDp7T9lCk9PgE', title: 'Full-Stack Web Development' },
      { id: 'PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp', title: 'Python for beginners' },
      { id: 'PLTenPTx8NQDJniUgCDAydREd8h2Bbi_NX', title: 'Python for beginners' },
    ]
  },
  // Add other sections here...
];

async function getPlaylistInfo(playlistId) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`);
    const playlist = response.data.items[0].snippet;
    return {
      title: playlist.title,
      description: playlist.description,
      thumbnail: playlist.thumbnails.medium.url,
    };
  } catch (error) {
    console.error('Error fetching playlist info:', error);
    return {};
  }
}

async function getPlaylistVideos(playlistId) {
  let videos = [];
  let nextPageToken = '';
  
  try {
    do {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 50, // Fetch maximum allowed per request
          pageToken: nextPageToken,
          key: API_KEY
        }
      });
      
      videos = videos.concat(response.data.items.map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoId: item.snippet.resourceId.videoId,
      })));
      
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return videos;
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
}


app.get('/', async (req, res) => {
  for (const section of courseSections) {
    for (const course of section.courses) {
      const playlistInfo = await getPlaylistInfo(course.id);
      Object.assign(course, playlistInfo);
    }
  }
  res.render('home', { quotes, courseSections });
});

app.get('/playlist/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId;
  const playlistInfo = await getPlaylistInfo(playlistId);
  const videos = await getPlaylistVideos(playlistId);
  res.render('playlist', { playlist: playlistInfo, videos });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});