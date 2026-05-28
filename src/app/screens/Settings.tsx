import { useState, useMemo, useEffect } from 'react';
import {
  User,
  Bell,
  CheckCircle,
  Droplet,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Moon,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useTowels } from '../context/TowelContext';

// Reusable iOS-style toggle
function Toggle({
  on,
  onClick,
  disabled = false,
}: {
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
        on ? 'bg-[#5A9E8C]' : 'bg-[#E8F5F1]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          on ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// Stacked folded towel icon (custom SVG)
function TowelIcon({ size = 22, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="15" width="18" height="5" rx="1.5" fill={color} fillOpacity="0.85" />
      <rect x="4" y="10" width="16" height="5" rx="1.5" fill={color} />
      <rect x="4" y="12" width="16" height="1" rx="0.5" fill="#F5D4C1" fillOpacity="0.7" />
      <rect x="5" y="5" width="14" height="5" rx="1.5" fill={color} fillOpacity="0.85" />
    </svg>
  );
}

// Small (2x2) widget preview
function SmallWidget({
  themeColor,
  towelName,
  hygiene,
  subtitle,
}: {
  themeColor: string;
  towelName: string;
  hygiene: number;
  subtitle: string;
}) {
  return (
    <div
      className="relative w-40 h-40 rounded-[22px] p-4 flex flex-col justify-between"
      style={{
        backgroundColor: themeColor,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex justify-between items-start">
        <TowelIcon size={22} />
        <div
          className="w-2 h-2 rounded-full bg-white"
          style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.3)' }}
        />
      </div>

      <div className="text-center">
        <p
          className="text-white m-0"
          style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.5px' }}
        >
          {hygiene}
          <span style={{ fontSize: '18px', fontWeight: 500 }}>%</span>
        </p>
        <p
          className="text-white/80 mt-1"
          style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px' }}
        >
          Hygiene
        </p>
      </div>

      <div>
        <p className="text-[13px] font-medium text-white truncate">{towelName}</p>
        <p className="text-[11px] text-white/75 truncate">{subtitle}</p>
      </div>
    </div>
  );
}

// Medium (4x2) widget preview — shows up to 3 towels
function MediumWidget({
  themeColor,
  towels,
}: {
  themeColor: string;
  towels: { name: string; hygiene: number }[];
}) {
  return (
    <div
      className="relative rounded-[22px] p-4 w-[290px] h-40"
      style={{
        backgroundColor: themeColor,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <TowelIcon size={18} />
          <p className="text-white text-[13px] font-medium m-0">My Towels</p>
        </div>
        <p className="text-white/70 text-[10px] m-0">{towels.length} active</p>
      </div>

      <div className="space-y-2.5">
        {towels.map((t, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <p className="text-white text-[11px] m-0 w-[88px] truncate">{t.name}</p>
            <div className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${t.hygiene}%` }}
              />
            </div>
            <p className="text-white text-[11px] font-medium m-0 w-8 text-right">
              {t.hygiene}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const widgetThemes = [
  { name: 'Mint', color: '#A8D5C5' },
  { name: 'Sky', color: '#B8D8E8' },
  { name: 'Peach', color: '#F5D4C1' },
  { name: 'Sand', color: '#E8DDD3' },
  { name: 'Sage', color: '#7FBF9F' },
  { name: 'Coral', color: '#F2B894' },
];

export function Settings() {
  const { towels } = useTowels();
  const [userName, setUserName] = useState('Alex');

  // Master notifications toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Granular notification channels
  const [washReminders, setWashReminders] = useState(true);
  const [hygieneAlerts, setHygieneAlerts] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);
  const [streaksMilestones, setStreaksMilestones] = useState(false);

  // Quiet hours
  const [quietHours, setQuietHours] = useState(true);

  // Real browser permission status
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | 'unsupported'
  >('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus('unsupported');
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermissionStatus(result);
    }
  };

  const sendTestNotification = () => {
    if (!notificationsEnabled) return;

    if (permissionStatus === 'granted' && 'Notification' in window) {
      new Notification('Towly', {
        body: 'Test notification ✓ — your alerts are working',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    } else if (permissionStatus === 'default') {
      requestPermission();
    } else if (permissionStatus === 'denied') {
      alert('Enable notifications in your browser settings to receive Towly alerts.');
    } else {
      alert('Notifications are not supported on this device.');
    }
  };

  // Widget state
  const [widgetSize, setWidgetSize] = useState<'small' | 'medium'>('small');
  const [selectedTheme, setSelectedTheme] = useState(widgetThemes[0]);

  // Real towel data for widget previews — falls back to demo data if context empty
  const firstTowel = towels[0];
  const widgetTowelName: string = (firstTowel as any)?.name ?? 'Morning Face';
  const widgetHygiene: number = (firstTowel as any)?.hygienePercentage ?? 85;
  const widgetSubtitle: string =
    widgetHygiene >= 70 ? 'Fresh & Chill' : widgetHygiene >= 40 ? 'Getting tired' : 'Wash me!';

  const mediumWidgetTowels = useMemo(() => {
    const real = towels.slice(0, 3).map((t: any) => ({
      name: t?.name ?? 'Towel',
      hygiene: t?.hygienePercentage ?? 80,
    }));
    if (real.length > 0) return real;
    return [
      { name: 'Morning Face', hygiene: 85 },
      { name: 'Main Bath', hygiene: 92 },
      { name: 'Gym Essential', hygiene: 45 },
    ];
  }, [towels]);

  const stats = useMemo(() => {
    const totalTowels = towels.length;
    const cleanTowels = towels.filter((t) => t.hygienePercentage >= 70).length;
    const highRiskTowels = towels.filter((t) => t.hygienePercentage < 40).length;
    const avgRisk = Math.round(
      towels.reduce((sum, t) => sum + (100 - t.hygienePercentage), 0) /
        (towels.length || 1)
    );

    return { totalTowels, cleanTowels, highRiskTowels, avgRisk };
  }, [towels]);

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-4">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-3xl font-medium text-[#4A4A4A] mb-6">Settings</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#5A9E8C] mb-1">{stats.totalTowels}</p>
            <p className="text-[10px] text-[#8B8B8B]">Towels</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#7FBF9F] mb-1">{stats.cleanTowels}</p>
            <p className="text-[10px] text-[#8B8B8B]">Clean</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#F2B894] mb-1">{stats.highRiskTowels}</p>
            <p className="text-[10px] text-[#8B8B8B]">High Risk</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#5A9E8C]/10 text-center">
            <p className="text-2xl font-medium text-[#4A4A4A] mb-1">{stats.avgRisk}%</p>
            <p className="text-[10px] text-[#8B8B8B]">Avg Risk</p>
          </div>
        </div>

        {/* User profile */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10 mb-4">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#E8F5F1] flex items-center justify-center mr-4">
              <User size={32} color="#5A9E8C" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-xl font-medium text-[#4A4A4A] bg-transparent border-b border-[#5A9E8C]/15 pb-1 focus:outline-none focus:border-[#5A9E8C]"
              />
              <p className="text-sm text-[#8B8B8B] mt-1">Your name</p>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10 mb-4">
          <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">Notifications</h3>

          <div className="bg-[#E8F5F1] rounded-2xl p-4 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#5A9E8C] flex items-center justify-center text-white flex-shrink-0">
                <Bell size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#4A4A4A]">Allow notifications</p>
                {permissionStatus === 'granted' && (
                  <p className="text-xs text-[#7FBF9F] flex items-center gap-1 mt-0.5">
                    <CheckCircle size={11} />
                    Permission granted
                  </p>
                )}
                {permissionStatus === 'default' && (
                  <button
                    onClick={requestPermission}
                    className="text-xs text-[#5A9E8C] mt-0.5 underline"
                  >
                    Tap to enable in browser
                  </button>
                )}
                {permissionStatus === 'denied' && (
                  <p className="text-xs text-[#F2B894] mt-0.5">Blocked in browser settings</p>
                )}
                {permissionStatus === 'unsupported' && (
                  <p className="text-xs text-[#8B8B8B] mt-0.5">Not supported on this device</p>
                )}
              </div>
            </div>
            <Toggle
              on={notificationsEnabled}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>

          <p className="text-[11px] font-medium tracking-wider text-[#8B8B8B] uppercase mb-2 ml-1">
            What to notify about
          </p>
          <div className={`mb-5 transition-opacity ${!notificationsEnabled ? 'opacity-40' : ''}`}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-[10px] bg-[#B8D8E8] flex items-center justify-center flex-shrink-0">
                  <Droplet size={16} color="#4A4A4A" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#4A4A4A]">Wash reminders</p>
                  <p className="text-xs text-[#8B8B8B]">When a towel needs washing</p>
                </div>
              </div>
              <Toggle
                on={washReminders}
                onClick={() => setWashReminders(!washReminders)}
                disabled={!notificationsEnabled}
              />
            </div>

            <div className="h-px bg-[#5A9E8C]/10 mx-1" />

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-[10px] bg-[#F5D4C1] flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} color="#4A4A4A" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#4A4A4A]">Hygiene alerts</p>
                  <p className="text-xs text-[#8B8B8B]">Critical: below 30%</p>
                </div>
              </div>
              <Toggle
                on={hygieneAlerts}
                onClick={() => setHygieneAlerts(!hygieneAlerts)}
                disabled={!notificationsEnabled}
              />
            </div>

            <div className="h-px bg-[#5A9E8C]/10 mx-1" />

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-[10px] bg-[#A8D5C5] flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={16} color="#4A4A4A" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#4A4A4A]">Weekly insights</p>
                  <p className="text-xs text-[#8B8B8B]">Sunday evening summary</p>
                </div>
              </div>
              <Toggle
                on={weeklyInsights}
                onClick={() => setWeeklyInsights(!weeklyInsights)}
                disabled={!notificationsEnabled}
              />
            </div>

            <div className="h-px bg-[#5A9E8C]/10 mx-1" />

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-[10px] bg-[#E8DDD3] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} color="#4A4A4A" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#4A4A4A]">Streaks &amp; milestones</p>
                  <p className="text-xs text-[#8B8B8B]">Optional achievements</p>
                </div>
              </div>
              <Toggle
                on={streaksMilestones}
                onClick={() => setStreaksMilestones(!streaksMilestones)}
                disabled={!notificationsEnabled}
              />
            </div>
          </div>

          <p className="text-[11px] font-medium tracking-wider text-[#8B8B8B] uppercase mb-2 ml-1">
            Timing
          </p>
          <div className={`mb-5 transition-opacity ${!notificationsEnabled ? 'opacity-40' : ''}`}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-[10px] bg-[#E8F5F1] flex items-center justify-center flex-shrink-0">
                  <Moon size={16} color="#5A9E8C" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#4A4A4A]">Quiet hours</p>
                  {quietHours && (
                    <p className="text-xs text-[#5A9E8C]">10:00 PM — 8:00 AM</p>
                  )}
                  {!quietHours && (
                    <p className="text-xs text-[#8B8B8B]">Notifications anytime</p>
                  )}
                </div>
              </div>
              <Toggle
                on={quietHours}
                onClick={() => setQuietHours(!quietHours)}
                disabled={!notificationsEnabled}
              />
            </div>
          </div>

          <p className="text-[11px] font-medium tracking-wider text-[#8B8B8B] uppercase mb-2 ml-1">
            Preview
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <div className="bg-[#E8F5F1] rounded-2xl p-3 flex items-start gap-2.5">
              <CheckCircle size={18} color="#7FBF9F" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-medium text-[#4A4A4A]">Safe Alert</p>
                <p className="text-xs text-[#8B8B8B] mt-0.5">
                  Your towels are fresh and clean
                </p>
              </div>
            </div>
            <div className="bg-[#FFF5F0] rounded-2xl p-3 flex items-start gap-2.5">
              <AlertCircle size={18} color="#F2B894" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-medium text-[#4A4A4A]">Danger Alert</p>
                <p className="text-xs text-[#8B8B8B] mt-0.5">Time to wash your towels</p>
              </div>
            </div>
          </div>

          <button
            onClick={sendTestNotification}
            disabled={!notificationsEnabled}
            className={`w-full py-3 rounded-2xl border border-dashed border-[#5A9E8C]/40 text-[#5A9E8C] text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              !notificationsEnabled
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-[#E8F5F1]/50 active:scale-[0.99]'
            }`}
          >
            <Send size={16} />
            Send a test notification
          </button>
        </div>

        {/* REDESIGNED WIDGET CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10 mb-4">
          <h3 className="text-lg font-medium text-[#4A4A4A] mb-1">Widget</h3>
          <p className="text-xs text-[#8B8B8B] mb-4">
            Customize how Towly looks on your home screen
          </p>

          {/* Size selector tabs */}
          <div className="flex gap-1.5 p-1 bg-[#F5EDE6] rounded-xl mb-3.5">
            <button
              onClick={() => setWidgetSize('small')}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                widgetSize === 'small'
                  ? 'bg-white text-[#5A9E8C] font-medium shadow-sm'
                  : 'text-[#8B8B8B]'
              }`}
            >
              Small
            </button>
            <button
              onClick={() => setWidgetSize('medium')}
              className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                widgetSize === 'medium'
                  ? 'bg-white text-[#5A9E8C] font-medium shadow-sm'
                  : 'text-[#8B8B8B]'
              }`}
            >
              Medium
            </button>
          </div>

          {/* Faux home screen preview */}
          <div
            className="relative rounded-2xl px-3 py-6 mb-5 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #C8DDE8 0%, #DDD0E0 50%, #F0D8C8 100%)',
            }}
          >
            {/* Status bar */}
            <div className="absolute top-2 left-0 right-0 flex justify-between px-4 text-[11px] text-white font-semibold">
              <span>9:41</span>
              <span className="tracking-wider">●●●● 5G</span>
            </div>

            {/* Widget */}
            <div className="flex justify-center pt-3.5">
              {widgetSize === 'small' ? (
                <SmallWidget
                  themeColor={selectedTheme.color}
                  towelName={widgetTowelName}
                  hygiene={widgetHygiene}
                  subtitle={widgetSubtitle}
                />
              ) : (
                <MediumWidget
                  themeColor={selectedTheme.color}
                  towels={mediumWidgetTowels}
                />
              )}
            </div>
          </div>

          {/* Color theme picker */}
          <p className="text-[11px] font-medium tracking-wider text-[#8B8B8B] uppercase mb-3 ml-1">
            Color theme
          </p>
          <div className="grid grid-cols-3 gap-3">
            {widgetThemes.map((theme) => {
              const isSelected = selectedTheme.name === theme.name;
              return (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div
                    className="w-full aspect-square max-w-[80px] rounded-[18px] transition-all"
                    style={{
                      backgroundColor: theme.color,
                      boxShadow: isSelected
                        ? '0 0 0 2.5px #5A9E8C, 0 0 0 5px white'
                        : 'none',
                    }}
                  />
                  <p
                    className={`text-xs m-0 ${
                      isSelected ? 'text-[#5A9E8C] font-medium' : 'text-[#8B8B8B]'
                    }`}
                  >
                    {theme.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
