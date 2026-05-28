import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useTowels } from '../context/TowelContext';

// 4-level mood derived from hygiene % — matches Care/Signs & Home
function getMood(percentage: number) {
  if (percentage >= 70) {
    return {
      name: 'Fresh & Chill',
      shortLabel: 'Fresh',
      img: '/avatars/towel-fresh.png',
      badgeBg: '#E1F5EE',
      badgeText: '#4A6E4A',
      zone: 3, // 0=retire, 1=wet, 2=warm, 3=fresh
    };
  }
  if (percentage >= 45) {
    return {
      name: 'Getting Warm',
      shortLabel: 'Warm',
      img: '/avatars/towel-warm.png',
      badgeBg: '#FAEEDA',
      badgeText: '#854F0B',
      zone: 2,
    };
  }
  if (percentage >= 20) {
    return {
      name: 'Wet Dog Energy',
      shortLabel: 'Wet Dog',
      img: '/avatars/towel-wet.png',
      badgeBg: '#FAECE7',
      badgeText: '#993C1D',
      zone: 1,
    };
  }
  return {
    name: 'Retirement Time',
    shortLabel: 'Retire',
    img: '/avatars/towel-retired.png',
    badgeBg: '#FCEBEB',
    badgeText: '#A32D2D',
    zone: 0,
  };
}

function MoodAvatar({ src, size = 80 }: { src: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        flexShrink: 0,
        backgroundColor: '#FAF7F4',
        border: '1px solid rgba(90, 158, 140, 0.1)',
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}

export function TowelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { towels, useTowel, washTowel, sosTowel } = useTowels();
  const [showSOS, setShowSOS] = useState(false);

  const towel = towels.find((t) => t.id === id);

  if (!towel) {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <p className="text-[#8B8B8B]">Towel not found</p>
      </div>
    );
  }

  const mood = getMood(towel.hygienePercentage);
  const pct = Math.max(0, Math.min(100, towel.hygienePercentage));

  // Days since last wash
  const lastWashedDate = new Date(towel.lastWashed);
  const lastWashedDayStr = lastWashedDate.toISOString().split('T')[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastWashedNormalized = new Date(lastWashedDate);
  lastWashedNormalized.setHours(0, 0, 0, 0);
  const daysSinceWash = Math.max(
    0,
    Math.floor(
      (today.getTime() - lastWashedNormalized.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const lastWashedSubtitle =
    daysSinceWash === 0
      ? 'Last washed today'
      : daysSinceWash === 1
      ? 'Last washed yesterday'
      : `Last washed ${daysSinceWash} days ago`;

  // Use/wash ratio
  const usesPerWashRaw =
    towel.totalWashes > 0 ? towel.totalUses / towel.totalWashes : 0;
  const usesPerWash =
    towel.totalWashes > 0 ? usesPerWashRaw.toFixed(1) : '—';

  // Last 7 days uses
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const last7DaysUses = (towel.usageHistory || []).filter((entry) => {
    const d = new Date(entry.date);
    return entry.used && d >= sevenDaysAgo;
  }).length;

  // 14-day activity strip
  const activityDays: {
    dateStr: string;
    used: boolean;
    isWashDay: boolean;
    isToday: boolean;
  }[] = [];
  const todayStr = today.toISOString().split('T')[0];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = (towel.usageHistory || []).find((h) => h.date === dateStr);
    activityDays.push({
      dateStr,
      used: !!entry?.used,
      isWashDay: dateStr === lastWashedDayStr,
      isToday: dateStr === todayStr,
    });
  }

  // Smart insights — dynamic based on mood + data
  const insights: string[] = [];
  if (mood.zone === 3) {
    insights.push(
      daysSinceWash === 0
        ? 'Just washed — towel is at peak freshness'
        : 'Hygiene is solid — keep up the routine'
    );
  } else if (mood.zone === 2) {
    insights.push('Hygiene declining — plan to wash within 1–2 days');
  } else if (mood.zone === 1) {
    insights.push('Hygiene critical — wash before next use');
  } else {
    insights.push('Bacterial risk high — deep wash or replace immediately');
  }
  if (towel.totalWashes > 0) {
    const ratio = usesPerWashRaw;
    const ratioVerdict =
      ratio <= 3 ? 'healthy routine' : 'consider washing more often';
    insights.push(
      `Average wash cycle: every ${usesPerWash} uses — ${ratioVerdict}`
    );
  }
  insights.push(`Used ${last7DaysUses} times in the last 7 days`);

  const handleSOS = (
    stainType: 'Blood' | 'Coffee' | 'Makeup' | 'Moisture'
  ) => {
    sosTowel(towel.id, stainType);
    setShowSOS(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="max-w-md mx-auto px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-3"
            >
              <ChevronLeft size={22} color="#4A4A4A" />
            </button>
            <h1 className="text-2xl font-medium text-[#4A4A4A]">
              {towel.name}
            </h1>
          </div>
          <MoodAvatar src={mood.img} size={48} />
        </div>

        {/* Hero mood card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 mb-3 flex items-center gap-4">
          <MoodAvatar src={mood.img} size={96} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-medium text-[#5A9E8C] leading-none">
                {towel.hygienePercentage}
              </span>
              <span className="text-lg font-medium text-[#5A9E8C]">%</span>
            </div>
            <span
              className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-lg mb-1.5"
              style={{ backgroundColor: mood.badgeBg, color: mood.badgeText }}
            >
              {mood.name}
            </span>
            <p className="text-xs text-[#8B8B8B] m-0">{lastWashedSubtitle}</p>
          </div>
        </div>

        {/* Gradient hygiene bar — Image 3 style */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 mb-3">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-sm font-medium text-[#4A4A4A]">
              Hygiene level
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: mood.badgeText }}
            >
              {mood.shortLabel}
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              height: '10px',
              backgroundColor: '#EEEAE3',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${pct}%`,
                height: '100%',
                backgroundImage:
                  'linear-gradient(to right, #D85A30 0%, #EF9F27 33%, #F4D03F 66%, #5A9E8C 100%)',
                backgroundSize:
                  pct > 0 ? `${(100 * 100) / pct}% 100%` : '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-medium tracking-wide">
            <span style={{ color: mood.zone === 0 ? mood.badgeText : '#8B8B8B' }}>
              RETIRE
            </span>
            <span style={{ color: mood.zone === 1 ? mood.badgeText : '#8B8B8B' }}>
              WET DOG
            </span>
            <span style={{ color: mood.zone === 2 ? mood.badgeText : '#8B8B8B' }}>
              WARM
            </span>
            <span style={{ color: mood.zone === 3 ? mood.badgeText : '#8B8B8B' }}>
              FRESH
            </span>
          </div>
        </div>

        {/* 3 quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#5A9E8C] m-0 leading-tight">
              {daysSinceWash}d
            </p>
            <p className="text-[11px] text-[#8B8B8B] m-0 mt-0.5">Since wash</p>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#5A9E8C] m-0 leading-tight">
              {towel.totalUses}
            </p>
            <p className="text-[11px] text-[#8B8B8B] m-0 mt-0.5">Total uses</p>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#5A9E8C] m-0 leading-tight">
              {towel.totalWashes}
            </p>
            <p className="text-[11px] text-[#8B8B8B] m-0 mt-0.5">Total washes</p>
          </div>
        </div>

        {/* Smart insights */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 mb-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-sm">✨</span>
            <h3 className="text-sm font-medium text-[#4A4A4A] m-0">
              Smart insights
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {insights.map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#5A9E8C] mt-1.5 flex-shrink-0" />
                <p className="text-[13px] text-[#4A4A4A] m-0 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 14-day activity strip */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[#4A4A4A] m-0">
              Last 14 days
            </h3>
            <div className="flex items-center gap-2.5 text-[10px] text-[#8B8B8B]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#5A9E8C]" />
                Used
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#7FBF9F]" />
                Wash
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(14, minmax(0, 1fr))',
              gap: '4px',
            }}
          >
            {activityDays.map((day) => (
              <div
                key={day.dateStr}
                style={{
                  aspectRatio: '1',
                  backgroundColor: day.isWashDay
                    ? '#7FBF9F'
                    : day.used
                    ? '#5A9E8C'
                    : '#E8F5F1',
                  borderRadius: '4px',
                  outline: day.isToday ? '2px solid #5A9E8C' : 'none',
                  outlineOffset: '-2px',
                }}
              />
            ))}
          </div>
          <p className="text-[11px] text-[#8B8B8B] m-0 mt-2 text-right">
            Today →
          </p>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 mb-3">
          <h3 className="text-sm font-medium text-[#4A4A4A] m-0 mb-3">
            Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-3">
            <div>
              <p className="text-[11px] text-[#8B8B8B] m-0">Type</p>
              <p className="text-[13px] font-medium text-[#4A4A4A] m-0">
                {towel.type}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8B8B8B] m-0">Skin sensitivity</p>
              <p className="text-[13px] font-medium text-[#4A4A4A] m-0">
                {towel.skinSensitivity}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8B8B8B] m-0">Environment</p>
              <p className="text-[13px] font-medium text-[#4A4A4A] m-0">
                {towel.environment}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8B8B8B] m-0">Last washed</p>
              <p className="text-[13px] font-medium text-[#4A4A4A] m-0">
                {lastWashedDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => useTowel(towel.id)}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#5A9E8C] text-white font-medium text-sm hover:bg-[#4F8C7B] transition-colors"
          >
            USED
          </button>
          <button
            onClick={() => washTowel(towel.id)}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#E8F5F1] text-[#5A9E8C] font-medium text-sm hover:bg-[#D4E8E0] transition-colors"
          >
            WASHED
          </button>
          <button
            onClick={() => setShowSOS(true)}
            className="px-4 py-3 rounded-2xl bg-[#FFF5F0] text-[#F2B894] font-medium text-sm hover:bg-[#FFE8DD] transition-colors flex items-center"
          >
            <AlertCircle size={16} className="mr-1" />
            SOS
          </button>
        </div>
      </div>

      {/* SOS modal */}
      {showSOS && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
          onClick={() => setShowSOS(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-medium text-[#4A4A4A] mb-4">
              Select Stain Type
            </h3>
            <div className="space-y-3">
              {(['Blood', 'Coffee', 'Makeup', 'Moisture'] as const).map(
                (stain) => (
                  <button
                    key={stain}
                    onClick={() => handleSOS(stain)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] text-[#4A4A4A] font-medium text-sm hover:bg-[#E8F5F1] transition-colors"
                  >
                    {stain}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setShowSOS(false)}
              className="w-full mt-4 px-4 py-3 rounded-xl bg-[#E8F5F1] text-[#5A9E8C] font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
