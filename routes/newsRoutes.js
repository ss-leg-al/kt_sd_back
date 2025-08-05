const express = require('express');
const axios = require('axios');

const router = express.Router();

const CLIENT_ID = process.env.NAVER_CLIENT_ID; // .env에 저장된 네이버 클라이언트 ID
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET; // .env에 저장된 네이버 클라이언트 시크릿

// 뉴스 검색 API
router.get('/', async (req, res) => {
  const query = req.query.query || '건강'; // 기본 검색어
  const display = req.query.display || 10; // 출력 개수 (기본값 10)
  const start = req.query.start || 1; // 시작 위치 (기본값 1)
  const sort = req.query.sort || 'sim'; // 정렬 방식 ('sim' 또는 'date', 기본값: 'sim')

  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
      params: { query, display, start,sort },
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news from Naver API.' });
  }
});

module.exports = router;