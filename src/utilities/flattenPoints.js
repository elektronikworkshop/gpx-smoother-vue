import {averageSlopeFromTotal} from './displayFormat';

export function flattenPoints(toFlatten, maxSlope, selection) {
  const dataLength = toFlatten.length;
  if (dataLength === 0)
    return;
  const smoothedValues = [];
  const maxDelta = Math.abs(Number(maxSlope)) / 100;
  let previous = null;
  let totalSlope = 0;
  for (let i = 0; i < dataLength; i++) {
    let point = {
      ...toFlatten[i]
    };
    if (previous) {
      if (i >= selection.startIdx && i <= selection.stopIdx) {
        let deltaSlope = point.slope - previous.slope;
        if (Math.abs(deltaSlope) > maxDelta) {
          if (deltaSlope > 0) {
            point.slope = previous.slope + maxDelta;
          } else if (deltaSlope < 0) {
            point.slope = previous.slope - maxDelta;
          }
        }
        point.ele = (point.slope * point.distance) + previous.ele;
      }
    }
    totalSlope = totalSlope + point.slope;
    smoothedValues.push(point);
    previous = point;
  }
  return {
    smoothedValues: smoothedValues,
    averageSlope: averageSlopeFromTotal(totalSlope, dataLength)
  };
}
