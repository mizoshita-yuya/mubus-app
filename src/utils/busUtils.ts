import { BusSchedule, BusTime } from "../types/bus";

export function getNextBuses(schedule: BusSchedule, currentTime: Date): BusTime[] {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const isWeekday = currentTime.getDay() >= 1 && currentTime.getDay() <= 5;
  const todaySchedule = isWeekday ? schedule.weekday : schedule.saturday;
  const upcomingBuses = todaySchedule.filter(bus => {
    if (bus.hour > currentHour) return true;
    if (bus.hour === currentHour && bus.minute > currentMinute) return true;
    return false;
  });
  return upcomingBuses.slice(0, 4);
}

export function getMinutesUntil(busTime: BusTime, currentTime: Date): number {
  const now = new Date(currentTime);
  const busDateTime = new Date(now);
  busDateTime.setHours(busTime.hour, busTime.minute, 0, 0);
  const diffMs = busDateTime.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60));
}

export function formatTimeUntil(minutes: number): string {
  if (minutes < 60) {
    return `あと${minutes}ぷん`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `あと${hours}じかん`;
    } else {
      return `あと${hours}じかん${remainingMinutes}ぷん`;
    }
  }
}

export function getDayTypeString(date: Date): string {
  const days = ["にちようび", "げつようび", "かようび", "すいようび", "もくようび", "きんようび", "どようび"];
  return days[date.getDay()];
}

export function getDepartureInfo(busTime: BusTime, currentTime: Date, nextBusTime?: BusTime) {
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const busMinutes = busTime.hour * 60 + busTime.minute;
  let nextBusMinutes: number | null = null;
  if (nextBusTime) {
    nextBusMinutes = nextBusTime.hour * 60 + nextBusTime.minute;
  }

  let message = "";
  let colorClass = "";

  if (nowMinutes >= busMinutes - 10 && nowMinutes < busMinutes) {
    // 次のバスの10分前～発車まで
    message = "いまからだと まにあわないよ";
    colorClass = "text-blue-600";
  } else if (
    nextBusMinutes !== null &&
    nowMinutes >= busMinutes &&
    nowMinutes < nextBusMinutes - 15
  ) {
    // 次のバス発車直後～その次のバス16分前まで
    message = "いえをでるじゅんびをしておこう";
    colorClass = "text-green-600";
  } else if (
    nextBusMinutes !== null &&
    nowMinutes >= nextBusMinutes - 15 &&
    nowMinutes < nextBusMinutes - 12
  ) {
    // その次のバス15分前～13分前
    message = "そろそろしゅっぱつしよう";
    colorClass = "text-yellow-600";
  } else if (
    nextBusMinutes !== null &&
    nowMinutes >= nextBusMinutes - 12 &&
    nowMinutes < nextBusMinutes - 10
  ) {
    // その次のバス12分前～11分前
    message = "いそいで!";
    colorClass = "text-red-600";
  } else if (
    nextBusMinutes !== null &&
    nowMinutes >= nextBusMinutes - 10 &&
    nowMinutes < nextBusMinutes
  ) {
    // その次のバス10分前～発車まで
    message = "いまからだと まにあわないよ";
    colorClass = "text-blue-600";
  } else if (nowMinutes >= busMinutes) {
    // 最終バス発車後
    message = "つぎのバスをまとう";
    colorClass = "text-gray-600";
  } else {
    // それ以外（始発前など）
    message = "いえをでるじゅんびをしておこう";
    colorClass = "text-green-600";
  }

  return {
    message,
    colorClass,
    shouldShowNextBus: (nowMinutes >= busMinutes - 10 && nowMinutes < busMinutes)
  };
}
