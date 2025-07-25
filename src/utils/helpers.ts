export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    let dayPart: string;

    if (isSameDay(date, now)) {
        dayPart = "Today";
    } else if (isSameDay(date, yesterday)) {
        dayPart = "Yesterday";
    } else {
        dayPart = date.toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    const timePart = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return `${dayPart} at ${timePart}`;
}