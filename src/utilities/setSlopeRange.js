import {averageSlopeFromTotal} from './displayFormat';

export function setSlopeRange(toFlatten, range, selection) {
  const dataLength = toFlatten.length;
  if (dataLength === 0) {
    return [];
  }
  var smoothedValues = [];
  var maxSlope = Number(range.maxSlope) / 100;
  var minSlope = Number(range.minSlope) / 100;
  let previous = null;
  let totalSlope = 0;
  for (let i = 0; i < dataLength; i++) {
    let point = {
      ...toFlatten[i]
    };
    if (previous) {
      let slope = toFlatten[i].slope;
      if (i >= selection.startIdx && i <= selection.stopIdx) {
        if (slope > maxSlope) {
          slope = maxSlope;
        } else if (slope < minSlope) {
          slope = minSlope;
        }
      }
      point.ele = (slope * point.distance) + previous.ele;
      point.slope = slope;
      totalSlope = totalSlope + point.slope;
    }
    smoothedValues.push(point);
    previous = point;
  }
  return {
    smoothedValues: smoothedValues,
    averageSlope: averageSlopeFromTotal(totalSlope, dataLength)
  };
}
