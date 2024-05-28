export default function getFormattedDate(dateString: string): string {
    // parse manually to avoid (day - 1) issue
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
}