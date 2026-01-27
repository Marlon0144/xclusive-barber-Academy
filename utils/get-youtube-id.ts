export function getYouTubeID(url: string | null): string | null {
  if (!url) return null;
  
  // Expresión regular que cubre urls cortas (youtu.be) y largas (youtube.com)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}   