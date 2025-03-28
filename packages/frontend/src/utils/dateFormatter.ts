import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export const formatGameReleaseDate = (date: string | undefined): string => {
  if (!date) return 'Date non définie';
  
  if (date.includes('-Q')) {
    const [year, quarter] = date.split('-');
    return `${year} ${quarter}`;
  }
  
  if (date.length === 7) {
    return dayjs(date).format('MMMM YYYY');
  }
  
  return dayjs(date).format('D MMMM YYYY');
};
