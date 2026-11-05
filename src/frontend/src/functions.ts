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

export function getdateFormatForDetailsPage(date: Date): string {
  //grab the day from the date
  const dateDay = date.getDate();

  //grab the month from the date
  const dateMonth = date.toLocaleString('default', { month: 'long' });

  //grab the year from the date
  const dateYear = date.getFullYear();

  return `${dateMonth} ${dateDay}, ${dateYear}`;
}
