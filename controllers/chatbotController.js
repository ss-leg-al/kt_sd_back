require('dotenv').config();
const { OpenAI } = require('openai');

// OpenAI 객체 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 대화 이력을 저장할 변수 (임시로 메모리에 저장, 지속적인 저장은 DB 사용 권장)
let conversationHistory = [];

exports.getHealthAdvice = async (req, res) => {
  const { question, role } = req.body;

  if (!question || !role) {
    return res.status(400).json({ error: 'Question and role are required' });
  }

  // 역할에 따른 시스템 메시지 설정
  const systemMessage =
    role === 'trainer'
      ? "너는 헬스트레이너야. 운동에 관한 전반적인 조언을 하고, 말할때는 200자 이내로 말해. 헬스에 진심이고 집착하는 사람이야"
      : "You are a certified nutritionist. Offer professional dietary advice, meal plans, and nutritional guidance.Answer me within 200 characters";

  try {
    // 시스템 메시지를 이력의 첫 번째 메시지로 추가
    if (conversationHistory.length === 0) {
      conversationHistory.push({ role: 'system', content: systemMessage });
    }
    if (conversationHistory.length > 10) {
        conversationHistory.shift(); // 가장 오래된 메시지 삭제
      }
    // 사용자의 질문 추가
    conversationHistory.push({ role: 'user', content: question });

    // OpenAI Chat API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // 또는 'gpt-3.5-turbo'
      messages: conversationHistory,
      max_tokens: 200,
    });

    // OpenAI 응답 처리
    const answer = response.choices[0]?.message?.content || 'No response from AI.';

    // AI 응답을 대화 이력에 추가
    conversationHistory.push({ role: 'assistant', content: answer });

    res.status(200).json({ answer });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};