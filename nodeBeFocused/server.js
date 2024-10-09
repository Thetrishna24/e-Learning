const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const API_KEY = API_KEY;

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
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}`);
    return response.data.items.map(item => ({
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      videoId: item.snippet.resourceId.videoId,
    }));
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
