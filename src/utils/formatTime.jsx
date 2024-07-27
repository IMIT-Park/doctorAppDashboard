export const formatTime = (time) => {
  if (!time || typeof time !== 'string' || !time.includes(":")) {
    return "Invalid time";
  }

  const timeParts = time.split(":").map(Number);

  if (timeParts.length < 2 || timeParts.length > 3) {
    return "Invalid time";
  }

  const [hours, minutes, seconds] = timeParts;

  if (
    isNaN(hours) || hours < 0 || hours > 23 ||
    isNaN(minutes) || minutes < 0 || minutes > 59 ||
    (seconds !== undefined && (isNaN(seconds) || seconds < 0 || seconds > 59))
  ) {
    return "Invalid time";
  }

  const date = new Date();
  date.setHours(hours, minutes, seconds || 0);

  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedTime;
};
