import { BusSchedule } from "../types/bus";

export const mitakaEkiSchedule: BusSchedule = {
  stopName: "三鷹駅北口",
  stopNameHiragana: "みたかえき",
  weekday: [
    { hour: 9, minute: 10 }, { hour: 9, minute: 30 }, { hour: 9, minute: 50 },
    { hour: 10, minute: 10 }, { hour: 10, minute: 30 }, { hour: 10, minute: 50 },
    { hour: 11, minute: 10 }, { hour: 11, minute: 30 }, { hour: 11, minute: 50 },
    { hour: 12, minute: 10 }, { hour: 12, minute: 30 }, { hour: 12, minute: 50 },
    { hour: 13, minute: 10 }, { hour: 13, minute: 30 }, { hour: 13, minute: 50 },
    { hour: 14, minute: 10 }, { hour: 14, minute: 30 }, { hour: 14, minute: 50 },
    { hour: 15, minute: 10 }, { hour: 15, minute: 30 }, { hour: 15, minute: 50 },
    { hour: 16, minute: 10 }, { hour: 16, minute: 30 }, { hour: 16, minute: 50 },
    { hour: 17, minute: 10 }, { hour: 17, minute: 30 }, { hour: 17, minute: 50 },
    { hour: 18, minute: 10 }, { hour: 18, minute: 30 }, { hour: 18, minute: 50 },
    { hour: 19, minute: 10 }, { hour: 19, minute: 30 }, { hour: 19, minute: 50 },
  ],
  saturday: [
    { hour: 9, minute: 10 }, { hour: 9, minute: 30 }, { hour: 9, minute: 50 },
    { hour: 10, minute: 10 }, { hour: 10, minute: 30 }, { hour: 10, minute: 50 },
    { hour: 11, minute: 10 }, { hour: 11, minute: 30 }, { hour: 11, minute: 50 },
    { hour: 12, minute: 10 }, { hour: 12, minute: 30 }, { hour: 12, minute: 50 },
    { hour: 13, minute: 10 }, { hour: 13, minute: 30 }, { hour: 13, minute: 50 },
    { hour: 14, minute: 10 }, { hour: 14, minute: 30 }, { hour: 14, minute: 50 },
    { hour: 15, minute: 10 }, { hour: 15, minute: 30 }, { hour: 15, minute: 50 },
    { hour: 16, minute: 10 }, { hour: 16, minute: 30 }, { hour: 16, minute: 50 },
    { hour: 17, minute: 10 }, { hour: 17, minute: 30 }, { hour: 17, minute: 50 },
    { hour: 18, minute: 10, isSpecial: true, note: "みたかえきまで" },
    { hour: 18, minute: 30 },
    { hour: 19, minute: 10 }, { hour: 19, minute: 50 },
  ],
};
