export const getShortDate = (isoDateString: string) => {
  const date = new Date(isoDateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });

  return `${day} ${month}`;
};
