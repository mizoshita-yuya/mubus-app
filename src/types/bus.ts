export interface BusTime {
  hour: number;
  minute: number;
  isSpecial?: boolean;
  note?: string;
}

export interface BusSchedule {
  stopName: string;
  stopNameHiragana: string;
  weekday: BusTime[];
  saturday: BusTime[];
}
