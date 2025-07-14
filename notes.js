const notes = Array.from({ length: 62 }, (_, i) => {
  const categories = ["pink", "blue", "yellow"];
  const category = categories[i % 3];
  const messages = {
    pink: ["You make my heart smile.", "Every day with you is a gift.", "You light up my world."],
    blue: ["I’m here, always.", "Even on cloudy days, I’m thinking of you.", "You are stronger than you think."],
    yellow: ["You’re my sunshine ☀️", "Here’s a virtual hug!", "Smile — you’re amazing!"]
  };
  const msgList = messages[category];
  return {
    id: i + 1,
    category,
    message: msgList[i % msgList.length]
  };
});
