import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini Client server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Rashaqa Weight Loss App" });
  });

  // AI Endpoint: AI Nutritionist / Coach
  app.post("/api/ai/nutrition-coach", async (req, res) => {
    try {
      const { userMessage, userProfile, chatHistory } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          reply:
            "أهلاً بك! مفتاح API الخاص بالذكاء الاصطناعي غير متوفر حالياً. لكن يمكنك استخدام جميع ميزات التطبيق المحلية وتتبع السعرات والوجبات بكل سهولة!",
        });
      }

      const systemPrompt = `أنت أخصائي تغذية خبير ومدرب لياقة متفضل ومحفز باللغة العربية باسم "مستشار رشاقة".
معلومات المستخدم:
- الوزن الحالي: ${userProfile?.currentWeight || 80} كجم
- الوزن المستهدف: ${userProfile?.targetWeight || 70} كجم
- الطول: ${userProfile?.height || 175} سم
- الهدف اليومي من السعرات: ${userProfile?.dailyCalorieGoal || 1800} سعرة
- نوع الحمية: ${userProfile?.dietType || "متوازن"}

أجب بدقة وود وبشكل مشجع ومختصر ومباشر مع تقديم نصائح علمية وعملية باللغة العربية.`;

      const contents = [
        { text: systemPrompt },
        ...(chatHistory || []).map((msg: any) => ({
          text: `${msg.role === "user" ? "المستخدم" : "المستشار"}: ${msg.content}`,
        })),
        { text: `المستخدم: ${userMessage}` },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents.map((c) => c.text).join("\n\n"),
      });

      res.json({ reply: response.text || "عذراً، لم أتمكن من معالجة الطلب حالياً." });
    } catch (error: any) {
      console.error("Gemini Coach Error:", error);
      res.status(500).json({
        error: "حدث خطأ أثناء التواصل مع المستشار الذكي",
        details: error.message,
      });
    }
  });

  // AI Endpoint: Personalized Meal Plan Generator
  app.post("/api/ai/generate-meal-plan", async (req, res) => {
    try {
      const { dietType, targetCalories, allergies, goal } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: "Gemini API Key missing",
        });
      }

      const prompt = `قم بإنشاء خطة وجبات صحية يومية متكاملة بأسلوب عربي ولذيذ بناءً على المعايير التالية:
- نوع الحمية: ${dietType || "متوازن"}
- الهدف اليومي من السعرات: ${targetCalories || 1800} سعرة حرارية
- الحساسيات أو التفضيلات: ${allergies || "لا يوجد"}
- الهدف: ${goal || "تنزيل الوزن"}

أعد الإجابة بصيغة JSON حصرية بالهيكل التالي:
{
  "title": "عنوان الخطة",
  "summary": "ملخص الخطة والقيم الغذائية",
  "dailyTargetCalories": number,
  "meals": [
    {
      "type": "الإفطار" | "الغداء" | "العشاء" | "وجبة خفيفة",
      "name": "اسم الوجبة باللغة العربية",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "prepTimeMinutes": number,
      "ingredients": ["مكون 1", "مكون 2"],
      "instructions": "طريقة التحضير باختصار"
    }
  ],
  "tips": ["نصيحة 1", "نصيحة 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              dailyTargetCalories: { type: Type.NUMBER },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    name: { type: Type.STRING },
                    calories: { type: Type.NUMBER },
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fats: { type: Type.NUMBER },
                    prepTimeMinutes: { type: Type.NUMBER },
                    ingredients: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    instructions: { type: Type.STRING },
                  },
                },
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      });

      const planData = JSON.parse(response.text || "{}");
      res.json({ plan: planData });
    } catch (error: any) {
      console.error("Meal Plan Error:", error);
      res.status(500).json({
        error: "فشل في توليد خطة الوجبات الذكية",
        details: error.message,
      });
    }
  });

  // AI Endpoint: Analyze Food Image
  app.post("/api/ai/analyze-food", async (req, res) => {
    try {
      const { imageBase64 } = req.body;

      if (!process.env.GEMINI_API_KEY || !imageBase64) {
        return res.status(400).json({ error: "Missing image or API key" });
      }

      // Strip data uri header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64,
              },
            },
            {
              text: `حلل هذه الصورة للوجبة الغذائية باللغة العربية وقدر السعرات الحرارية والعناصر الكبرى (بروتين، كربوهيدرات، دهون).
أعد الناتج بترميز JSON كالتالي:
{
  "foodName": "اسم الوجبة باللغة العربية",
  "estimatedWeightGram": 250,
  "calories": 450,
  "protein": 30,
  "carbs": 40,
  "fats": 12,
  "healthRating": "صحي جداً" | "معتدل" | "عالي السعرات",
  "description": "وصف ملخص للوجبة ومحتوياتها",
  "healthyAdvice": "نصيحة غذائية لتحسين الوجبة"
}`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING },
              estimatedWeightGram: { type: Type.NUMBER },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              healthRating: { type: Type.STRING },
              description: { type: Type.STRING },
              healthyAdvice: { type: Type.STRING },
            },
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json({ analysis: result });
    } catch (error: any) {
      console.error("Analyze food error:", error);
      res.status(500).json({ error: "فشل تحليل صورة الوجبة", details: error.message });
    }
  });

  // Vite development middleware or static serve in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
