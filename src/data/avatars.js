export const AVATARS = [
  { id: 1, emoji: '😊', bg: '#FED7D7' },
  { id: 2, emoji: '😎', bg: '#C6F6D5' },
  { id: 3, emoji: '🥰', bg: '#FEFCBF' },
  { id: 4, emoji: '😇', bg: '#BEE3F8' },
  { id: 5, emoji: '🤩', bg: '#E9D8FD' },
  { id: 6, emoji: '😏', bg: '#FED7E2' },
  { id: 7, emoji: '🧐', bg: '#C4F1F9' },
  { id: 8, emoji: '🤗', bg: '#FEEBC8' },
];

export const getAvatar = (id) => AVATARS.find(a => a.id === id) || AVATARS[0];
