export function doyToDate(doy, year = 2024) {
  const d = new Date(Date.UTC(year, 0, 1));
  d.setUTCDate(d.getUTCDate() + (doy - 1));
  return d;
}
