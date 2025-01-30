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


export function getTodayDate() {
  const date = new Date().toISOString().slice(0, 10)
  const [year, month, day] = date.split("-");
  return `${year}-${month}-${day}`;
}

export function getFirstAndLastDayOfWeek(date) {
  const firstDay = new Date(date);
  const lastDay = new Date(date);

  const dayOfWeek = date.getDay();
  firstDay.setDate(date.getDate() - dayOfWeek);
  lastDay.setDate(date.getDate() + (6 - dayOfWeek));

  return {
      firstDay,
      lastDay
  };
}
