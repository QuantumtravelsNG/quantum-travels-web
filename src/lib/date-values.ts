export function parseDateValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function isValidDateValue(value: string): boolean {
  return Boolean(parseDateValue(value));
}

export function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayDateValue(): string {
  return formatDateValue(new Date());
}

export function addDaysToDateValue(value: string, offset: number): string {
  const date = parseDateValue(value);
  if (!date) return "";

  date.setDate(date.getDate() + offset);
  return formatDateValue(date);
}

export function formatDateValueForDisplay(value: string): string {
  const date = parseDateValue(value);
  if (!date) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
