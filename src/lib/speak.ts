export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const clean = text.replace(/\s*\(.*?\)\s*/g, " ").trim();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
