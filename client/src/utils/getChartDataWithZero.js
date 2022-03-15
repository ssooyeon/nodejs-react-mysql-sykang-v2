import moment from "moment/moment";

export const getChartData = (data, params) => {
  let dailyList;
  const end = moment(new Date()).format("YYYY-MM-DD");

  if (params.category === "date") {
    // 일별 통계일 경우 한달치 제공
    const start = moment(new Date()).add("-1", "M").format("YYYY-MM-DD");
    dailyList = getDatesStartToLast(start, end);
  } else if (params.category === "month") {
    // 월별 통계일 경우 일년치 제공
    const start = moment(new Date()).add("-1", "Y").format("YYYY-MM-DD");
    dailyList = getMonthsStartToLast(start, end);
  }

  let result = [];
  let arrayIndex = 0;

  for (var i = 0; i < dailyList.length; i++) {
    if (data[arrayIndex] !== undefined && data[arrayIndex].name === dailyList[i]) {
      result.push({ name: data[arrayIndex].name, count: data[arrayIndex].count });
      arrayIndex++;
    } else {
      result.push({ name: dailyList[i], count: 0 });
    }
  }
  return result;
};

// 날짜 사이의 모든 날짜 구하기 (일)
const getDatesStartToLast = (startDate, lastDate) => {
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
const getMonthsStartToLast = (startMonth, lastMonth) => {
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
