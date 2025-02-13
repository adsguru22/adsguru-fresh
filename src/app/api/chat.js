export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("✅ Incoming Request:", req.body); // Debug log

  try {
    const { message, model = "gpt-4" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Pilih AI yang sesuai berdasarkan mesej pengguna
    let selectedModel = model;
    if (message.toLowerCase().includes("generate image")) {
      selectedModel = "dall-e-3"; // AI untuk gambar
    } else if (message.toLowerCase().includes("generate video")) {
      selectedModel = "runway"; // AI untuk video (contoh, jika ada API)
    } else if (message.toLowerCase().includes("analyze trends")) {
      selectedModel = "claude"; // AI untuk analisis data (contoh)
    }

    console.log(`🚀 Using AI Model: ${selectedModel}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel, // Model AI yang dipilih
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    console.log("✅ OpenAI Response:", data); // Debug log

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${data.error?.message || "Unknown error"}`);
    }

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response from AI",
    });

  } catch (error) {
    console.error("❌ API Error:", error);

    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
}
