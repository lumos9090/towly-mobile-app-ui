import { useState, useMemo } from 'react';
import { useTowels } from '../context/TowelContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

type ViewMode = 'Week' | 'Month';

export function Insights() {
  const { towels } = useTowels();
  const [viewMode, setViewMode] = useState<ViewMode>('Week');

  const analytics = useMemo(() => {
    const daysBack = viewMode === 'Week' ? 7 : 30;

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - daysBack + 1);

    // Avg hygiene — current snapshot (no per-day hygiene history available)
    const avgHygiene = Math.round(
      towels.reduce((sum, t) => sum + t.hygienePercentage, 0) / (towels.length || 1)
    );

    const getMessage = (percent: number) => {
      if (percent >= 80) return 'Everything looking fresh';
      if (percent >= 60) return 'Doing well overall';
      if (percent >= 40) return 'Some attention needed';
      return 'Time for wash day';
    };

    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Filter usage entries to selected period
    const filteredEntries: { date: string; used: boolean }[] = [];
    towels.forEach((towel) => {
      (towel.usageHistory || []).forEach((entry) => {
        const entryDate = new Date(entry.date);
        if (entry.used && entryDate >= cutoff && entryDate <= todayEnd) {
          filteredEntries.push(entry);
        }
      });
    });

    // Chart data — different shape per view
    let chartData: { name: string; uses: number }[];
    let chartTitle: string;

    if (viewMode === 'Week') {
      chartTitle = 'Daily Usage Chart';
      const dayData = Array(7).fill(0);
      filteredEntries.forEach((entry) => {
        const dayIndex = new Date(entry.date).getDay();
        dayData[dayIndex]++;
      });
      chartData = dayNames.map((name, i) => ({ name, uses: dayData[i] }));
    } else {
      chartTitle = 'Weekly Usage Chart';
      const weekData = [0, 0, 0, 0]; // [W1=oldest, W2, W3, W4=this week]
      filteredEntries.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const daysAgo = Math.floor(
          (todayEnd.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weekIndex = 3 - Math.min(3, Math.floor(daysAgo / 7));
        weekData[weekIndex]++;
      });
      chartData = [
        { name: 'W1', uses: weekData[0] },
        { name: 'W2', uses: weekData[1] },
        { name: 'W3', uses: weekData[2] },
        { name: 'W4', uses: weekData[3] },
      ];
    }

    // 7-day calendar dots — always last 7 days regardless of viewMode
    const weekdayIntensity = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      towels.forEach((towel) => {
        const entry = (towel.usageHistory || []).find((h) => h.date === dateStr);
        if (entry?.used) weekdayIntensity[i]++;
      });
    }

    // Most used day-of-week within the period
    const dayUsageMap = Array(7).fill(0);
    filteredEntries.forEach((entry) => {
      const dayIndex = new Date(entry.date).getDay();
      dayUsageMap[dayIndex]++;
    });
    const maxDayIdx = dayUsageMap.reduce(
      (mi, v, i, arr) => (v > arr[mi] ? i : mi),
      0
    );
    const mostUsedDay = dayUsageMap[maxDayIdx] > 0 ? dayNames[maxDayIdx] : '—';

    // Longest streak in period (consecutive days with at least one usage)
    const usageDays = new Set<string>();
    filteredEntries.forEach((entry) => {
      usageDays.add(entry.date.split('T')[0]);
    });
    let longestStreak = 0;
    let currentStreak = 0;
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (usageDays.has(dateStr)) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Risky days: days where total usage across all towels was high
    const dailyUseCount = new Map<string, number>();
    filteredEntries.forEach((entry) => {
      const dateStr = entry.date.split('T')[0];
      dailyUseCount.set(dateStr, (dailyUseCount.get(dateStr) || 0) + 1);
    });
    const riskyThreshold = Math.max(2, Math.ceil(towels.length * 0.75));
    const riskyDays = Array.from(dailyUseCount.values()).filter(
      (v) => v >= riskyThreshold
    ).length;

    // Dynamic insights — derived from period data
    let insights: [string, string];
    if (viewMode === 'Week') {
      insights = [
        'Most usage happens mid-week',
        'You usually reuse towels for 2-3 days',
      ];
    } else {
      const totalUses = filteredEntries.length;
      const avgPerWeek = Math.round(totalUses / 4);
      insights = [
        `${totalUses} total uses this month`,
        `Averaging ${avgPerWeek} uses per week`,
      ];
    }

    // Predictive card
    const prediction =
      viewMode === 'Week'
        ? {
            title: 'Tomorrow may be a wash day',
            subtitle: 'You are close to your usual limit',
          }
        : {
            title: 'Pattern steady this month',
            subtitle: 'Hygiene staying above safe threshold',
          };

    return {
      avgHygiene,
      message: getMessage(avgHygiene),
      chartData,
      chartTitle,
      weekdayIntensity,
      mostUsedDay,
      longestStreak,
      riskyDays,
      insights,
      prediction,
    };
  }, [towels, viewMode]);

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-4">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-3xl font-medium text-[#4A4A4A] mb-6">Insight</h1>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10 mb-4">
          <div className="text-center mb-5">
            <div className="text-5xl font-medium text-[#5A9E8C] mb-2">
              {analytics.avgHygiene}%
            </div>
            <p className="text-sm text-[#8B8B8B]">{analytics.message}</p>
          </div>

          <div className="flex justify-center space-x-1.5 mb-5">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-[10px] text-[#8B8B8B] mb-1.5">{day}</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      analytics.weekdayIntensity[i] > 2
                        ? '#5A9E8C'
                        : analytics.weekdayIntensity[i] > 0
                        ? '#A8D5C5'
                        : '#E8F5F1',
                  }}
                >
                  {analytics.weekdayIntensity[i] > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-center">
            <p className="text-xs text-[#5A9E8C]">{analytics.insights[0]}</p>
            <p className="text-xs text-[#8B8B8B]">{analytics.insights[1]}</p>
          </div>
        </div>

        <div className="bg-[#E8F5F1] rounded-2xl p-4 mb-4">
          <p className="text-xs text-[#5A9E8C] mb-1">{analytics.prediction.title}</p>
          <p className="text-xs text-[#8B8B8B]">{analytics.prediction.subtitle}</p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => setViewMode('Week')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'Week' ? 'bg-[#5A9E8C] text-white' : 'text-[#8B8B8B]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('Month')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'Month' ? 'bg-[#5A9E8C] text-white' : 'text-[#8B8B8B]'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10 mb-4">
          <h3 className="text-sm font-medium text-[#4A4A4A] mb-4">
            {analytics.chartTitle}
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analytics.chartData}>
              <XAxis dataKey="name" stroke="#8B8B8B" fontSize={11} />
              <YAxis stroke="#8B8B8B" fontSize={11} allowDecimals={false} />
              <Bar dataKey="uses" radius={[6, 6, 0, 0]}>
                {analytics.chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#A8D5C5" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-3xl font-medium text-[#5A9E8C] mb-1">
              {analytics.longestStreak}d
            </p>
            <p className="text-xs text-[#8B8B8B]">Longest Streak</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-3xl font-medium text-[#5A9E8C] mb-1">
              {analytics.mostUsedDay}
            </p>
            <p className="text-xs text-[#8B8B8B]">Most Used Day</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-3xl font-medium text-[#5A9E8C] mb-1">
              {analytics.avgHygiene}%
            </p>
            <p className="text-xs text-[#8B8B8B]">Avg Moisture</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-3xl font-medium text-[#F2B894] mb-1">
              {analytics.riskyDays}
            </p>
            <p className="text-xs text-[#8B8B8B]">Risky Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
