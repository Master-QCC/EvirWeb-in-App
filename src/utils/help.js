/* jshint esversion: 6 */
function getDate(day) {
  const date = day ? new Date(day) : new Date();
  const indexDate = date.getDay();
  const seperator = '-';
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  const weekday = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];

  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  const currentdate = year + seperator + month + seperator + strDate;
  const todayInWeekValue = currentdate + ' ' + weekday[indexDate];
  return {
    currentdate: currentdate,
    todayInWeekValue: todayInWeekValue
  };
}

function getDay(day) {
  const today = new Date();
  const seperator = '-';

  const targetDay = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetDay);
  const tYear = today.getFullYear();
  let tMonth = today.getMonth() + 1;
  let tDate = today.getDate();

  if (tMonth >= 1 && tMonth <= 9) {
    tMonth = '0' + tMonth;
  }

  if (tDate >= 0 && tDate <= 9) {
    tDate = '0' + tDate;
  }

  return tYear + seperator + tMonth + seperator + tDate;
}

export default {
  getDate: getDate,
  getDay: getDay
};
