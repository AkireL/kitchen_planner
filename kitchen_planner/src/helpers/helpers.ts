export function getDayOfDate(date: string) {
  const [year, month, day] = date.split('-');
  const formattedDate = `${year}-${month}-${day}`;

  const dateTmp = new Date(formattedDate);

  return dateTmp.getDay();
}

export function getDateByString(date: string) {
  const [year, month, day] = date.split('-');
  return `${year}-${month}-${day}`;
}

export function getTodayDate() {
  const date = new Date().toISOString().slice(0, 10);
  const [year, month, day] = date.split('-');
  return `${year}-${month}-${day}`;
}

export function getFirstAndLastDayOfWeek(date: Date) {
  const firstDay = new Date(date);
  const lastDay = new Date(date);

  const dayOfWeek = date.getDay();
  firstDay.setDate(date.getDate() - dayOfWeek + 1);
  lastDay.setDate(date.getDate() + (7 - dayOfWeek));

  return {
    firstDay,
    lastDay,
  };
}

export function getNextWeek(startDate: Date) {
  const date = getFirstAndLastDayOfWeek(startDate);
  const start = date.firstDay;

  const nextMonday = new Date(start);
  nextMonday.setDate(start.getDate() + 7);
  nextMonday.setHours(0, 0, 0, 0);

  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);
  nextSunday.setHours(0, 0, 0, 0);

  return {
    start: nextMonday,
    end: nextSunday,
  };
}

export function getPreviousWeek(startDate: Date) {
  const date = getFirstAndLastDayOfWeek(startDate);
  const start = date.firstDay;

  const previousMonday = new Date(start);
  previousMonday.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 7);
  previousMonday.setHours(0, 0, 0, 0);

  const previousSunday = new Date(previousMonday);
  previousSunday.setDate(previousMonday.getDate() + 6);
  previousSunday.setHours(0, 0, 0, 0);

  return {
    start: previousMonday,
    end: previousSunday,
  };
}
