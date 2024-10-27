export const getShortDate = (time: number) => {
  const date = new Date(time);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });

  return `${day} ${month}`;
};
