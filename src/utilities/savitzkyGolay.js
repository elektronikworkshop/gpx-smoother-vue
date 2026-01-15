import {averageSlopeFromTotal} from './displayFormat';

export function savitzkyGolay(toSmooth, options, selection) {
  const dataLength = toSmooth.length;
  if (dataLength === 0) {
    return [];
  }

  let distance = 0;
  const xValues = [];
  const yValues = [];

  // Collect the x and y values to be smoothed
  for (let i = 0; i < dataLength; i++) {
    const point = toSmooth[i];
    if (i >= selection.startIdx && i <= selection.stopIdx) {
      xValues.push(distance);
      yValues.push(point.ele);
    }
    // ucf: sure this computation after pushing x?
    distance =  distance + point.distance;
    if (i > selection.stopIdx) {
      break;
    }
  }

  let newValues = [];
  if (xValues.length > 0 && yValues.length > 0) {
    // Run the points through the algorithm
    const SG = require('ml-savitzky-golay-generalized');
    newValues = SG(yValues, xValues, options);
  }

  let smoothedValues = [];
  let previous = null;
  let totalSlope = 0;
  let newValueIndex = 0;
  for (let i = 0; i < dataLength; i++) {
    let point = {
      ...toSmooth[i]
    };
    if (i >= selection.startIdx && i <= selection.stopIdx) {
      point.ele = newValues[newValueIndex++];
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
