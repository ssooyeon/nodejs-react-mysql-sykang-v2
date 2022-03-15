// 날짜 사이의 모든 날짜 구하기 (일)
export const getDatesStartToLast = (startDate, lastDate) => {
  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if (!(regex.test(startDate) && regex.test(lastDate))) return "Not Date Format";
  var result = [];
  var curDate = new Date(startDate);
  while (curDate <= new Date(lastDate)) {
    result.push(curDate.toISOString().split("T")[0]);
    curDate.setDate(curDate.getDate() + 1);
  }
  return result;
};

// 날짜 사이의 모든 날짜 구하기 (월)
export const getMonthsStartToLast = (startMonth, lastMonth) => {
  var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
  if (!(regex.test(startMonth) && regex.test(lastMonth))) return "Not Date Format";
  var result = [];
  var curDate = new Date(startMonth);
  while (curDate <= new Date(lastMonth)) {
    let yyymmdd = curDate.toISOString().split("T")[0];
    result.push(yyymmdd.slice(0, 7));
    curDate.setMonth(curDate.getMonth() + 1);
  }
  return result;
};
