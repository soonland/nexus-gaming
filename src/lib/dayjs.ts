import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import calendar from 'dayjs/plugin/calendar'

// Étendre dayjs avec les plugins nécessaires
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(updateLocale)
dayjs.extend(calendar)

// Définir le français comme locale par défaut
dayjs.locale('fr')

// Personnaliser les messages relatifs
dayjs.updateLocale('fr', {
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  }
})

export const formatters = {
  relative: (date: Date | string) => dayjs(date).fromNow(),
  short: (date: Date | string) => dayjs(date).format('D MMM YYYY'),
  long: (date: Date | string) => dayjs(date).format('D MMMM YYYY [à] HH:mm'),
  calendar: (date: Date | string) => dayjs(date).calendar(null, {
    sameDay: '[Aujourd\'hui à] HH:mm',
    nextDay: '[Demain à] HH:mm',
    nextWeek: 'dddd [à] HH:mm',
    lastDay: '[Hier à] HH:mm',
    lastWeek: 'dddd [dernier à] HH:mm',
    sameElse: 'D MMMM YYYY'
  }),
  custom: (date: Date | string, format: string) => dayjs(date).format(format)
}

export default dayjs
