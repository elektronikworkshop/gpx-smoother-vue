import {averageSlopeFromTotal} from './displayFormat';

export function restoreAscentDescentSection(toRestore, rawValues, startidx, stopidx)
{
  const section = restoreAscentDescent(toRestore.slice(startidx, stopidx),
                                       rawValues.slice(startidx, stopidx));
  let restored = rawValues.slice();
  restored.splice(startidx, section.smoothedValues.length, ...section.smoothedValues);

  let totalSlope = 0;
  restored.forEach( point => {
    totalSlope += point.slope;
  });

  return {
    smoothedValues: restored,
    averageSlope: averageSlopeFromTotal(totalSlope, toRestore.length)
  };
}

function restoreAscentDescent(modValues, srcValues)
{
    const L = modValues.length;
    if (srcValues.length === 0 ||
        modValues.length === 0 ||
        modValues.length != srcValues.length) {
      return;
    }

    var totalDistance = 0;
    srcValues.forEach(point => {
      totalDistance += point.distance;
    });

    const srcStartPoint = srcValues[0];
    const srcEndPoint = srcValues[L - 1];
    const modStartPoint = modValues[0];
    const modEndPoint = modValues[L - 1];

    const startVOffset = srcStartPoint.ele - modStartPoint.ele;
    const endVOffset = srcEndPoint.ele - modEndPoint.ele;
    const slopeComp = (endVOffset - startVOffset) / totalDistance;

    let totalSlope = 0;
    let dist = 0;
    let previous = null;
    const compensatedValues = modValues.slice();
    compensatedValues.forEach(point => {
      if (previous) {
        point.slope = 0;
        if (point.distance) {
          dist += point.distance;
          point.ele += dist * slopeComp + startVOffset;
          point.slope = (point.ele - previous.ele) / point.distance;
        }
      } else {
        point.ele += startVOffset;
      }
      previous = point;
      totalSlope += point.slope;
    });

    return {
      smoothedValues: compensatedValues,
      averageSlope: averageSlopeFromTotal(totalSlope, L)
    };
}
