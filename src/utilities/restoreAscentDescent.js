import {averageSlopeFromTotal} from './displayFormat';

export function restoreAscentDescent(toRestore, rawValues) {

    const dataLength = toRestore.length;
    if (rawValues.length === 0 ||
        toRestore.length === 0 ||
        toRestore.length != dataLength) {
      return;
    }

    var distanceRaw = 0;
    for (var i = 0; i < dataLength; i++) {
      distanceRaw += rawValues[i].distance;
    }

    const rawB = rawValues[0];
    const rawE = rawValues[dataLength - 1];
    const smoothB = toRestore[0];
    const smoothE = toRestore[dataLength - 1];

    const startOff = rawB.ele - smoothB.ele;
    const endOff = rawE.ele - smoothE.ele;
    const slopeComp = (endOff - startOff) / distanceRaw;

    const restoredAscentVals = [];
    let totalSlope = 0;
    let dist = 0;
    let previous = null;
    for (i = 0; i < dataLength; i++) {
      let point =  {
        ...toRestore[i]
      };
      if (previous) {
        point.slope = 0;
        if (point.distance) {
          dist += point.distance;
          point.ele += dist * slopeComp + startOff;
          point.slope = (point.ele - previous.ele) / point.distance;
        }
      } else {
        point.ele += startOff;
      }
      restoredAscentVals.push(point);
      previous = point;
      totalSlope += point.slope;
    }

    return {
      smoothedValues: restoredAscentVals,
      averageSlope: averageSlopeFromTotal(totalSlope, dataLength)
    };
}
