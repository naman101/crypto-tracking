export const getLocaleCurrency = (value: string) => {
  return new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(parseFloat(value));
};
