function generatePoem(words) {
  if (words.length < 8) {
    return "Need eight words to weave a poem.";
  }

  const [a, b, c, d, e, f, g, h] = words;
  const templates = [
    () =>
      `In the hush of ${a},\n` +
      `where ${b} meets ${c},\n` +
      `I found a ${d} waiting—\n` +
      `soft as ${e}, bright as ${f}.\n\n` +
      `The ${g} told stories;\n` +
      `the ${h} kept them all.\n` +
      `Eight words, one breath—\n` +
      `and I remembered everything.`,

    () =>
      `${cap(a)} on my tongue,\n` +
      `${b} in the air,\n` +
      `${c} and ${d} tangled\n` +
      `in ${e}'s golden hair.\n\n` +
      `Through ${f} I wandered,\n` +
      `past ${g}, toward ${h}—\n` +
      `a poem written\n` +
      `before I knew I could.`,

    () =>
      `Tonight the ${a} is listening.\n` +
      `It hears ${b}, and ${c},\n` +
      `and every ${d} we ever lost\n` +
      `to the ${e}.\n\n` +
      `Hold ${f} close.\n` +
      `Let ${g} be your compass.\n` +
      `When ${h} arrives,\n` +
      `be ready to begin again.`,

    () =>
      `I collected: ${a}, ${b}, ${c},\n` +
      `${d}, ${e}, ${f}, ${g}, ${h}.\n\n` +
      `Like seeds in winter soil,\n` +
      `they slept inside the game—\n` +
      `then bloomed into this verse,\n` +
      `each word still warm with flame.`,

    () =>
      `Between ${a} and ${b},\n` +
      `a ${c} learned to fly.\n` +
      `${d} watched from far away;\n` +
      `${e} asked the reason why.\n\n` +
      `${f} answered without words.\n` +
      `${g} painted sky and sea.\n` +
      `And ${h}—dear ${h}—\n` +
      `became the key to me.`,
  ];

  const pick = templates[Math.floor(Math.random() * templates.length)];
  return pick();
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
