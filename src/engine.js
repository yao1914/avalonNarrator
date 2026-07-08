export function generateNarrationScript(roles) {
  const script = [];

  function speak(text, pause = 2.5) {
    script.push({ text, pause });
  }

  speak("Everyone, close your eyes and extend your hand into a fist in front of you.", 3);

  // 1. Minions acknowledge each other (Oberon stays asleep, Mordred wakes up)
  if (roles.Oberon) {
    speak("All minions of Mordred, except Oberon, open your eyes and look around to acknowledge each other.");
  } else {
    speak("Minions of Mordred, open your eyes and look around to acknowledge each other.");
  }

  speak("Minions of Mordred, close your eyes.");

  // 2. Merlin sees Minions (Mordred stays hidden)
  if (roles.Mordred) {
    speak("Minions of Mordred, except Mordred himself, extend your thumbs so that Merlin may know you.");
  } else {
    speak("Minions of Mordred, extend your thumbs so that Merlin may know you.");
  }

  speak("Merlin, open your eyes and see the minions of Mordred.", 4);
  speak("Merlin, close your eyes. Minions, put your thumbs down.");

  // 3. Percival sees Merlin & Morgana
  if (roles.Percival) {
    if (roles.Morgana) {
      speak("Merlin and Morgana, extend your thumbs so that Percival may know you.");
    } else {
      speak("Merlin, extend your thumb so that Percival may know you.");
    }

    speak("Percival, open your eyes and see the thumbs.", 4);
    speak("Percival, close your eyes. Thumbs down.");
  }

  // 4. Wake up
  speak("Everyone, open your eyes.", 0);

  return script;
}
