export function getDatefromDateTimeString(date: string): string {
  const dateObj = new Date(date);
  //grab the day from the date
  const dateDay = dateObj.getDate();

  //grab the month from the date
  const dateMonth = dateObj.getMonth();

  //grab the year from the date
  const dateYear = dateObj.getFullYear();

  return `${dateMonth} / ${dateDay} / ${dateYear}`;
}

export function formatDateTimeFromDate(date: Date): string {
  const dateObj = new Date(date);
  //grab the day from the date
  const dateDay = dateObj.getDate();

  //grab the month from the date
  const dateMonth = dateObj.getMonth();

  //grab the year from the date
  const dateYear = dateObj.getFullYear();

  return `${dateMonth} / ${dateDay} / ${dateYear}`;
}

// Short, locale-aware date such as "Nov 6, 2026". Used on the homepage.
export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getdateFormatForDetailsPage(date: Date): string {
  //grab the day from the date
  const dateDay = date.getDate();

  //grab the month from the date
  const dateMonth = date.toLocaleString('default', { month: 'long' });

  //grab the year from the date
  const dateYear = date.getFullYear();

  return `${dateMonth} ${dateDay}, ${dateYear}`;
}
