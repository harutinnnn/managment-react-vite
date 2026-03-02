export const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const formatDateOnly = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getDate())}-${pad(d.getMonth() + 1)}`;
};