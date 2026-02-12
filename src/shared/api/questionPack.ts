export async function fetchDefaultQuestionPack() {
  const resp = await fetch("../../app/questions.json");
  if (!resp) throw new Error("Failed to load question pack");
  return resp.json();
}
