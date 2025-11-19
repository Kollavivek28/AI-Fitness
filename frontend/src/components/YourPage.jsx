import { useState } from "react";
import ImagePreview from "./components/ImagePreview";
import { generateExerciseImage } from "../backend/generateExerciseImage";

export default function YourPage() {
  const [prompt, setPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);

    const url = await generateExerciseImage(prompt, "workout");

    setImgUrl(url);
    setLoading(false);
  }

  return (
    <>
      <input 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter exercise"
      />

      <button onClick={handleGenerate}>Generate</button>

      <ImagePreview
        title="Result"
        prompt={prompt}
        url={imgUrl}
        loading={loading}
        onClose={() => setImgUrl("")}
      />
    </>
  );
}
