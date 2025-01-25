export function currentTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const timeString = `${String(hours).padStart(2, "0")}_${String(minutes).padStart(2, "0")}_${String(seconds).padStart(2, "0")}`;

  const dateTimeString = `${dateString} ${timeString}`;

  return dateTimeString;
}
