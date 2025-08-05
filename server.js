// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const newsRoutes = require('./routes/newsRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const PORT = 4000;

app.use(cors()); // 프론트와 연결을 위해 CORS 허용
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true }));

app.use('/news', newsRoutes);
app.use('/chat', chatbotRoutes);

// 테스트 라우터
app.get('/', (req, res) => {
  res.send('서버 정상 작동 중!');
});

// API 예시
app.get('/api/test', (req, res) => {
  res.json({ message: '환경도우미 백엔드 테스트 성공!' });
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});