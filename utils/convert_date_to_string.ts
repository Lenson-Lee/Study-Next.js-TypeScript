import moment from 'moment';

function convertDateToString(dateString: string): string {
  const dateTime = moment(dateString, moment.ISO_8601).milliseconds(0);
  const now = moment();

  /**현재시간으로부터의 시간 차이 */
  const diff = now.diff(dateTime);
  const calDuration = moment.duration(diff);
  const years = calDuration.years();
  const days = calDuration.days();
  const hours = calDuration.hours();
  const minutes = calDuration.minutes();
  const seconds = calDuration.seconds();
}
