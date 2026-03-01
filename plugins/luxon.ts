import { DateTime } from 'luxon';
export default defineNuxtPlugin(nuxtApp => {

    const parseDate = (input: string | number | Date): DateTime => {
        if (typeof input === 'number') {
            // millis timestamp (epoch)
            return DateTime.fromMillis(input)
        }

        if (input instanceof Date) {
            return DateTime.fromJSDate(input)
        }

        if (typeof input === 'string') {
            // Try ISO format first
            const iso = DateTime.fromISO(input)
            if (iso.isValid) return iso

            // Try parsing via JS Date
            const jsDate = new Date(input)
            if (!isNaN(jsDate.getTime())) {
                return DateTime.fromJSDate(jsDate)
            }

            // Add custom format fallback if needed here

            return DateTime.invalid('Unrecognized string format')
        }

        return DateTime.invalid('Unsupported input type')
    }

    return {
        provide: {
            DateTime,
            parseDate,
        }
    }
})