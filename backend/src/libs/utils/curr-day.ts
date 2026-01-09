export const currDay = () => {
  const today = new Date();
  const currDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date(today.setHours(23, 59, 59, 999));

  return {
    currDate,
    currMonth: today.getMonth() + 1,
    currYear: today.getFullYear(),
    startOfToday,
    endOfToday,
  };
};
