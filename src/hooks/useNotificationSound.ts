export const useNotificationSound = () => {
  const play = () => {
    const audio = new Audio('/sound.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {}); // catch por si el browser bloquea
  };

  return { play };
};