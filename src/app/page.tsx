"use client";
import { useState, useEffect } from 'react';

// 時刻表データの型定義
interface BusTime {
  hour: number;
  minute: number;
  isSpecial?: boolean;
  note?: string;
}

interface BusSchedule {
  stopName: string;
  stopNameHiragana: string;
  weekday: BusTime[];
  saturday: BusTime[];
}

// 三鷹駅北口の時刻表データ
const mitakaEkiSchedule: BusSchedule = {
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

// ユーティリティ関数
function getNextBuses(schedule: BusSchedule, currentTime: Date): BusTime[] {
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

function getMinutesUntil(busTime: BusTime, currentTime: Date): number {
  const now = new Date(currentTime);
  const busDateTime = new Date(now);
  busDateTime.setHours(busTime.hour, busTime.minute, 0, 0);
  
  const diffMs = busDateTime.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60));
}

function formatTimeUntil(minutes: number): string {
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

function getDayTypeString(date: Date): string {
  const days = ["にちようび", "げつようび", "かようび", "すいようび", "もくようび", "きんようび", "どようび"];
  return days[date.getDay()];
}

// 家を出る時間の情報を取得
function getDepartureInfo(busTime: BusTime, currentTime: Date) {
  const busMinutes = getMinutesUntil(busTime, currentTime);
  const departureMinutes = busMinutes - 10; // 10分前に家を出る
  
  let message = "";
  let colorClass = "";
  
  if (busMinutes <= 10) {
    // バスまで10分以内の場合は次のバスを案内
    message = "つぎのバスにしよう";
    colorClass = "text-blue-600";
  } else if (departureMinutes > 5) {
    message = "まだだいじょうぶ";
    colorClass = "text-green-600";
  } else if (departureMinutes > 2) {
    message = "そろそろしゅっぱつ";
    colorClass = "text-yellow-600";
  } else {
    message = "いそいで!";
    colorClass = "text-red-600";
  }
  
  return {
    minutes: departureMinutes,
    message,
    colorClass,
    timeString: busMinutes <= 10 ? "つぎのバスを みよう" : formatTimeUntil(Math.max(0, departureMinutes)),
    shouldShowNextBus: busMinutes <= 10
  };
}

function BusScheduleApp() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextBuses, setNextBuses] = useState<BusTime[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = debugMode ? currentTime : new Date();
      if (!debugMode) {
        setCurrentTime(now);
      }
      setNextBuses(getNextBuses(mitakaEkiSchedule, now));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [debugMode, currentTime]);

  const handleDebugTimeChange = (hour: number, minute: number) => {
    const newTime = new Date();
    newTime.setHours(hour, minute, 0, 0);
    setCurrentTime(newTime);
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour}:${minute.toString().padStart(2, '0')}`;
  };

  const formatCurrentTime = (date: Date): string => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* デバッグモード切り替え */}
      <div className="bg-gray-200 p-2 text-center">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="text-sm bg-gray-500 text-white px-3 py-1 rounded"
        >
          {debugMode ? "リアルタイムモード" : "デバッグモード"}
        </button>
      </div>

      {/* デバッグ時刻設定 */}
      {debugMode && (
        <div className="bg-yellow-100 p-3 text-center">
          <p className="text-sm mb-2">じかんせってい:</p>
          <div className="flex justify-center gap-2 flex-wrap mb-3">
            <button onClick={() => handleDebugTimeChange(9, 25)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">9:25</button>
            <button onClick={() => handleDebugTimeChange(12, 45)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">12:45</button>
            <button onClick={() => handleDebugTimeChange(15, 15)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">15:15</button>
            <button onClick={() => handleDebugTimeChange(18, 5)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">18:05</button>
            <button onClick={() => handleDebugTimeChange(19, 45)} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">19:45</button>
          </div>
          
          <div className="border-t pt-3">
            <p className="text-sm mb-2">いろのテスト (9:10のバス):</p>
            <div className="flex justify-center gap-2 flex-wrap mb-2">
              <button onClick={() => handleDebugTimeChange(8, 55)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">8:55 (15分前)</button>
              <button onClick={() => handleDebugTimeChange(9, 0)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">9:00 (10分前)</button>
              <button onClick={() => handleDebugTimeChange(9, 3)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">9:03 (7分前)</button>
              <button onClick={() => handleDebugTimeChange(9, 5)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">9:05 (5分前)</button>
              <button onClick={() => handleDebugTimeChange(9, 6)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">9:06 (4分前)</button>
              <button onClick={() => handleDebugTimeChange(9, 8)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">9:08 (2分前)</button>
              <button onClick={() => handleDebugTimeChange(9, 9)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">9:09 (1分前)</button>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              <button onClick={() => handleDebugTimeChange(9, 11)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">9:11 (つぎのバス)</button>
              <button onClick={() => handleDebugTimeChange(9, 15)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">9:15 (つぎのバス)</button>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-xl font-bold">ムーバス {mitakaEkiSchedule.stopNameHiragana}</h1>
      </div>

      {/* 現在時刻 */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-lg">
          📅 {getDayTypeString(currentTime)} {formatCurrentTime(currentTime)}
        </p>
      </div>

      {/* 次のバス */}
      {nextBuses.length > 0 && (
        <div className="p-6 text-center bg-blue-50 border-b-2 border-blue-200">
          <h2 className="text-lg font-bold mb-2">🚌 つぎのバス</h2>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatTime(nextBuses[0].hour, nextBuses[0].minute)}
          </div>
          <div className="text-xl text-green-600 font-bold">
            {formatTimeUntil(getMinutesUntil(nextBuses[0], currentTime))}
          </div>
          {nextBuses[0].isSpecial && (
            <div className="text-sm text-orange-600 mt-1">
              {nextBuses[0].note}
            </div>
          )}
          
          {/* 家を出る時間 */}
          <div className="mt-4 p-3 bg-white rounded-lg border-2 border-gray-200">
            {getDepartureInfo(nextBuses[0], currentTime).shouldShowNextBus ? (
              <div className="text-center">
                <div className={`text-2xl font-bold ${getDepartureInfo(nextBuses[0], currentTime).colorClass}`}>
                  {getDepartureInfo(nextBuses[0], currentTime).message}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">🏠 いえをでるじかん</h3>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {(() => {
                    const busHour = nextBuses[0].hour;
                    const busMinute = nextBuses[0].minute;
                    const departureHour = busMinute >= 10 ? busHour : busHour - 1;
                    const departureMinute = busMinute >= 10 ? busMinute - 10 : busMinute + 50;
                    return formatTime(departureHour, departureMinute);
                  })()}
                </div>
                <div className={`text-lg font-bold ${getDepartureInfo(nextBuses[0], currentTime).colorClass}`}>
                  {getDepartureInfo(nextBuses[0], currentTime).timeString}
                </div>
                <div className={`text-lg font-bold mt-1 ${getDepartureInfo(nextBuses[0], currentTime).colorClass}`}>
                  {getDepartureInfo(nextBuses[0], currentTime).message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* その後のバス */}
      {nextBuses.length > 1 && (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3">そのあとのバス</h3>
          <div className="space-y-2">
            {nextBuses.slice(1).map((bus, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="text-lg font-bold">
                  {formatTime(bus.hour, bus.minute)}
                </div>
                <div className="text-green-600">
                  {formatTimeUntil(getMinutesUntil(bus, currentTime))}
                </div>
                {bus.isSpecial && (
                  <div className="text-sm text-orange-600">
                    {bus.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* バスがない場合 */}
      {nextBuses.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-lg text-gray-600">きょうのバスは おわりました</p>
        </div>
      )}
    </div>
  );
}

export default BusScheduleApp;