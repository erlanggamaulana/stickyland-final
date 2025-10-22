// api/recommend.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });


    const { userPrompt, productCatalog } = req.body;

    if (!userPrompt || !productCatalog) {
      return res.status(400).json({ error: 'User prompt and product catalog are required.' });
    }

    const fullPrompt = `Anda adalah seorang ahli alat tulis yang ramah dan membantu di toko StickyLand. Berdasarkan kebutuhan pelanggan dan daftar produk yang tersedia, rekomendasikan 3-5 produk yang paling sesuai. Jelaskan secara singkat mengapa setiap produk berguna. Daftar produk yang tersedia adalah: ${productCatalog}. Kebutuhan pelanggan: "${userPrompt}"`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ recommendationsText: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to get recommendations from AI.' });
  }
}