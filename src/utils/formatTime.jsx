export const formatTime = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, seconds);

  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedTime;
};
