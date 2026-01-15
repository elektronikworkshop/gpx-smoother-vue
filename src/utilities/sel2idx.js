
export function sel2idx(values, selectionStartDist, selectionEndDist)
{
  let i = 0;
  let distance = 0;
  let startidx = 0;
  let stopidx = values.length - 1;
  values.forEach(point => {
    distance = distance + point.distance;
    if (distance >= selectionStartDist &&
        distance <= selectionEndDist)
    {
      if (startidx === 0) {
        startidx = i;
      }
      stopidx = i;
    }
    i++;
  });
  return {
    startIdx: startidx,
    stopIdx: stopidx
  };
}
