export function getDayOfDate(date: string) {
  const [day, month, year] = date.split("-");
  const formattedDate = `${year}-${month}-${day}`;

  const dateTmp = new Date(formattedDate);

  return dateTmp.getDay();
}
