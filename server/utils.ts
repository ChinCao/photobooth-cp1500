export function currentTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const dateString = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
  const timeString = `${String(hours).padStart(2, "0")}h_${String(minutes).padStart(2, "0")}m_${String(seconds).padStart(2, "0")}s`;

  const dateTimeString = `${dateString}-${timeString}`;

  return dateTimeString;
}
