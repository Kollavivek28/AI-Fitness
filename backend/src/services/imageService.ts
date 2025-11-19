export async function generateExerciseImage(prompt: string, type: ImageType = "generic") {
  const base = DEFAULT_PROMPTS[type];
  const finalPrompt = `${base}: ${prompt}`;

  const HF_URL = "https://router.huggingface.co/hf-inference/text-to-image";

  const response = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: finalPrompt,
      model: "black-forest-labs/FLUX.1-schnell",
      parameters: { width: 512, height: 512 }
    }),
  });

  // Read everything
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // PRINT RAW RESPONSE (THIS IS WHAT I NEED)
  console.log("HF RAW:", buffer.toString());

  const contentType = response.headers.get("content-type");

  if (!contentType?.startsWith("image/")) {
    throw new Error("HF Error: " + buffer.toString());
  }

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}
