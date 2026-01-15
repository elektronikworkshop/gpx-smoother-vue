import {averageSlopeFromTotal} from './displayFormat';

export function boxSmoothing(values, numPoints, selection) {
  const dataLength = values.length;
  if (dataLength === 0) {
    return [];
  }
  let smoothingSize = Math.floor(Number(numPoints)/2);
  if (smoothingSize < 2 || smoothingSize > dataLength / 2) {
    smoothingSize = 2;
  }
  const toSmooth = values;
  let newElevations = [];
  for (let i = 0; i < dataLength; i++) {
    let sumValues = 0;
    let start = i - smoothingSize;
    if (start < 0) {
      start = 0;
    }
    let end = i + smoothingSize;
    if (end > dataLength - 1){
      end = dataLength - 1;
    }
    for (let j = start; j <= end; j++) {
      sumValues += toSmooth[j].ele;
    }
    newElevations.push(sumValues / (end - start + 1));
  }
  let smoothedValues = [];
  let previous = null;
  let totalSlope = 0;
  for (let i = 0; i < dataLength; i++) {
    let point = {
      ...toSmooth[i]
    };
    if (i >= selection.startIdx && i <= selection.stopIdx) {
      point.ele = newElevations[i];
      point.slope = 0;
      if (previous && point.distance) {
        point.slope = (point.ele - previous.ele) / point.distance;
      }
    }
    smoothedValues.push(point);
    previous = point;
    totalSlope = totalSlope + point.slope;
  }

  return {
    smoothedValues: smoothedValues,
    averageSlope: averageSlopeFromTotal(totalSlope, dataLength)
  };
}
