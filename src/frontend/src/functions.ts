export function getDatefromDateTime(date: Date): string {
  //grab the day from the date
  const dateDay = date.getDate();

  //grab the month from the date
  const dateMonth = date.getMonth();

  //grab the year from the date
  const dateYear = date.getFullYear();

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
