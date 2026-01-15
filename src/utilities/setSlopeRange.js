import {averageSlopeFromTotal} from './displayFormat';
import {restoreAscentDescentSection} from './restoreAscentDescent';

export function setSlopeRange(toFlatten, range, selection) {
  const dataLength = toFlatten.length;
  if (dataLength === 0) {
    return [];
  }
  var smoothedValues = [];
  var maxSlope = Number(range.maxSlope) / 100;
  var minSlope = Number(range.minSlope) / 100;
  let startDistance = selection[0];
  let endDistance = selection[1];
  let distance = 0;
  let previous = null;
  let totalSlope = 0;
  let startidx = 0;
  let stopidx = dataLength - 1;
  for (let i = 0; i < dataLength; i++) {
    let point = {
      ...toFlatten[i]
    };
    if (previous) {
      let slope = toFlatten[i].slope;
      distance = distance + point.distance;
      if (distance >= startDistance && distance <= endDistance) {
        if (startidx === 0) {
          startidx = i;
        }
        stopidx = i;
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
  const restored = restoreAscentDescentSection(smoothedValues, toFlatten, startidx, stopidx);
  return {
    smoothedValues: restored.smoothedValues,
    averageSlope: averageSlopeFromTotal(totalSlope, dataLength)
  };
}
