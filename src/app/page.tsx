"use client";
import { useState, useEffect } from 'react';
import { getNextBuses, getMinutesUntil, formatTimeUntil, getDayTypeString, getDepartureInfo } from "../utils/busUtils";

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
    <div className="max-w-md mx-auto bg-white min-h-screen text-gray-900">
      {/* デバッグモード切り替え */}
      <div className="bg-gray-100 p-2 text-center">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="text-sm bg-blue-400 text-white px-3 py-1 rounded shadow hover:bg-blue-500 transition"
        >
          {debugMode ? "リアルタイムモード" : "デバッグモード"}
        </button>
      </div>

      {/* デバッグ時刻設定 */}
      {debugMode && (
        <div className="bg-yellow-50 p-3 text-center border-b border-yellow-200">
          <p className="text-sm mb-2 text-gray-800">じかんせってい:</p>
          <div className="flex justify-center gap-2 flex-wrap mb-3">
            {/* 分岐ごとに確認できる時刻ボタン */}
            <button onClick={() => handleDebugTimeChange(8, 59)} className="bg-green-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-green-500 transition">8:59<br/>（じゅんび）</button>
            <button onClick={() => handleDebugTimeChange(9, 0)} className="bg-green-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-green-500 transition">9:00<br/>（じゅんび）</button>
            <button onClick={() => handleDebugTimeChange(9, 7)} className="bg-yellow-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-yellow-500 transition">9:07<br/>（そろそろ）</button>
            <button onClick={() => handleDebugTimeChange(9, 3)} className="bg-red-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-red-500 transition">9:03<br/>（いそいで）</button>
            <button onClick={() => handleDebugTimeChange(9, 5)} className="bg-red-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-red-500 transition">9:05<br/>（いそいで）</button>
            <button onClick={() => handleDebugTimeChange(9, 8)} className="bg-blue-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-blue-500 transition">9:08<br/>（まにあわない）</button>
            <button onClick={() => handleDebugTimeChange(9, 10)} className="bg-gray-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-gray-500 transition">9:10<br/>（つぎのバス）</button>
            <button onClick={() => handleDebugTimeChange(9, 11)} className="bg-gray-400 text-white px-2 py-1 rounded text-sm shadow hover:bg-gray-500 transition">9:11<br/>（つぎのバス）</button>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="bg-blue-400 text-white p-4 text-center shadow">
        <h1 className="text-xl font-bold">ムーバス <span className="text-blue-100">{mitakaEkiSchedule.stopNameHiragana}</span></h1>
      </div>

      {/* 現在時刻 */}
      <div className="bg-gray-50 p-4 text-center border-b border-gray-200">
        <p className="text-lg text-gray-900">
          📅 {getDayTypeString(currentTime)} {formatCurrentTime(currentTime)}
        </p>
      </div>

      {/* 次のバス */}
      {nextBuses.length > 0 && (
        <div className="p-6 text-center bg-blue-50 border-b-2 border-blue-200">
          <h2 className="text-lg font-bold mb-2 text-blue-700">🚌 つぎのバス</h2>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {formatTime(nextBuses[0].hour, nextBuses[0].minute)}
          </div>
          <div className="text-xl text-green-500 font-bold">
            {formatTimeUntil(getMinutesUntil(nextBuses[0], currentTime))}
          </div>
          {nextBuses[0].isSpecial && (
            <div className="text-sm text-orange-500 mt-1">
              {nextBuses[0].note}
            </div>
          )}
          {/* 家を出る時間 */}
          <div className="mt-4 p-3 bg-white rounded-lg border-2 border-gray-100">
            {getDepartureInfo(nextBuses[0], currentTime, nextBuses[1]).shouldShowNextBus ? (
              <div className="text-center">
                <div className={`text-2xl font-bold ${getDepartureInfo(nextBuses[0], currentTime, nextBuses[1]).colorClass.replace('600','500')}`}> {/* 色を500系に */}
                  {getDepartureInfo(nextBuses[0], currentTime, nextBuses[1]).message}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2 text-gray-800">🏠 いえをでるじかん</h3>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {(() => {
                    const busHour = nextBuses[0].hour;
                    const busMinute = nextBuses[0].minute;
                    const departureHour = busMinute >= 10 ? busHour : busHour - 1;
                    const departureMinute = busMinute >= 10 ? busMinute - 10 : busMinute + 50;
                    return formatTime(departureHour, departureMinute);
                  })()}
                </div>
                <div className={`text-lg font-bold mt-1 ${getDepartureInfo(nextBuses[0], currentTime, nextBuses[1]).colorClass.replace('600','500')}`}> {/* 色を500系に */}
                  {getDepartureInfo(nextBuses[0], currentTime, nextBuses[1]).message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* その後のバス */}
      {nextBuses.length > 1 && (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-3 text-blue-700">そのあとのバス</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
              <div className="text-lg font-bold text-gray-900">
                {formatTime(nextBuses[1].hour, nextBuses[1].minute)}
              </div>
              <div className="text-green-500">
                {formatTimeUntil(getMinutesUntil(nextBuses[1], currentTime))}
              </div>
              {nextBuses[1].isSpecial && (
                <div className="text-sm text-orange-500">
                  {nextBuses[1].note}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* バスがない場合 */}
      {nextBuses.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-lg text-gray-500">きょうのバスは おわりました</p>
        </div>
      )}
    </div>
  );
}

export default BusScheduleApp;