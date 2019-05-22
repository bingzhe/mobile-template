export function numFix(value) {
  // 截取当前数据到小数点后两位
  let realVal = Number(value).toFixed(2);
  // num.toFixed(2)获取的是字符串
  // return Number(realVal);
  return realVal;
}

export function numFixOne(value) {
  // 截取当前数据到小数点后两位
  let realVal = Number(value).toFixed(1);
  // num.toFixed(2)获取的是字符串
  // return Number(realVal);
  return realVal;
}