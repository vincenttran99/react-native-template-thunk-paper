namespace DateHelper {

  /**
   * Converts seconds to a formatted string in the format HH:MM:SS.
   *
   * @param {number} totalSeconds - The total number of seconds to be converted.
   * @returns {string} - The formatted time string in HH:MM:SS format.
   *
   * Example:
   * toHHMMSS(3661) // Returns: '01:01:01'
   */
  export function secondsToHHMMSS(totalSeconds: number): string {
    // Calculate hours, minutes, and seconds
    const hours: number = Math.floor(totalSeconds / 3600);
    const minutes: number = Math.floor(totalSeconds / 60) % 60;
    const seconds: number = totalSeconds % 60;

    // Format hours, minutes, and seconds with leading zeros if necessary
    const formattedTime: string = [hours, minutes, seconds]
      .map(value => value < 10 ? "0" + value : value)
      // Hide leading zeros for hours if they are zero
      // .filter((value, index) => value !== "00" || index > 0)
      .join(":");

    return formattedTime;
  }


}

export default DateHelper;
