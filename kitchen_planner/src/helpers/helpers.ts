export function getDayOfDate(date: string) {
  const [year, month, day] = date.split("-");
  const formattedDate = `${year}-${month}-${day}`;

  const dateTmp = new Date(formattedDate);

  return dateTmp.getDay();
}

export function getDateByString(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}-${month}-${day}`;
}

