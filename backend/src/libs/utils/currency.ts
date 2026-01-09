type CurrencyType = { localeCode: string; currencyType: string };

export const formatCurrency = (value: number, options?: CurrencyType) => {
  const { localeCode = 'id-ID', currencyType = 'IDR' } = options || {};

  const style = new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency: currencyType,
  });

  return style.format(value);
};
