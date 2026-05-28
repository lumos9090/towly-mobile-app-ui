import { useState } from 'react';

type TabType = 'Washing' | 'Skin & Space' | 'Signs';

const moodLevels = [
  {
    name: 'Fresh & Chill',
    range: '70 – 100%',
    description: 'Towel is clean and hygienic. Safe for daily use, face included.',
    action: 'Continue regular use. Ensure proper drying between uses to maintain freshness.',
    img: '/avatars/towel-fresh.png',
    badgeBg: '#E1F5EE',
    badgeText: '#4A6E4A',
  },
  {
    name: 'Getting Warm',
    range: '45 – 69%',
    description: 'Midweek humidity kicked in. Used a few times — consider washing soon.',
    action: 'Plan to wash within 1–2 days. Avoid using on face if you have sensitive skin.',
    img: '/avatars/towel-warm.png',
    badgeBg: '#FAEEDA',
    badgeText: '#854F0B',
  },
  {
    name: 'Wet Dog Energy',
    range: '20 – 44%',
    description: 'Peak stink detected. Wash before next use — not safe for skin.',
    action: 'Wash immediately. Do not use on face or sensitive areas until properly cleaned.',
    img: '/avatars/towel-wet.png',
    badgeBg: '#FAECE7',
    badgeText: '#993C1D',
  },
  {
    name: 'Retirement Time',
    range: '0 – 19%',
    description: "Don't risk it. Bacterial overload — discard or deep-clean immediately.",
    action: 'Deep wash with hot water and antibacterial detergent — or retire the towel entirely.',
    img: '/avatars/towel-retired.png',
    badgeBg: '#FCEBEB',
    badgeText: '#A32D2D',
  },
];

// Towel mascot avatar — clean character image, no cropping
function TowelAvatar({ src, size = 80 }: { src: string; size?: number }) {
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

export function Care() {
  const [activeTab, setActiveTab] = useState<TabType>('Washing');

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-4">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-3xl font-medium text-[#4A4A4A] mb-6">Care</h1>

        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {(['Washing', 'Skin & Space', 'Signs'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#5A9E8C] text-white shadow-md'
                  : 'bg-white text-[#4A4A4A] border border-[#5A9E8C]/15'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Washing' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10">
              <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">
                Temperature Guide
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#4A4A4A]">Hot Water</span>
                    <span className="text-xs text-white bg-[#F2B894] px-3 py-1 rounded-full">
                      60°C - 90°C
                    </span>
                  </div>
                  <p className="text-sm text-[#8B8B8B]">
                    Best for white towels and deep cleaning. Kills most bacteria.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#4A4A4A]">Warm Water</span>
                    <span className="text-xs text-white bg-[#F2D99C] px-3 py-1 rounded-full">
                      40°C - 60°C
                    </span>
                  </div>
                  <p className="text-sm text-[#8B8B8B]">
                    Ideal for colored towels. Balances cleaning and care.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#4A4A4A]">Cold Water</span>
                    <span className="text-xs text-white bg-[#A8D5C5] px-3 py-1 rounded-full">
                      Below 40°C
                    </span>
                  </div>
                  <p className="text-sm text-[#8B8B8B]">
                    For delicate fabrics and energy saving. Gentle on fibers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10">
              <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">Drying Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A9E8C] mt-2 mr-3 flex-shrink-0" />
                  <p className="text-sm text-[#4A4A4A]">
                    Tumble dry on low heat to maintain softness
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A9E8C] mt-2 mr-3 flex-shrink-0" />
                  <p className="text-sm text-[#4A4A4A]">
                    Air dry in sunlight for natural freshness
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A9E8C] mt-2 mr-3 flex-shrink-0" />
                  <p className="text-sm text-[#4A4A4A]">
                    Shake towels before drying to fluff fibers
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A9E8C] mt-2 mr-3 flex-shrink-0" />
                  <p className="text-sm text-[#4A4A4A]">
                    Avoid fabric softener to preserve absorbency
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'Skin & Space' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10">
              <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">
                Skin Sensitivity Recommendations
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Sensitive Skin</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Wash every 2-3 uses. Use hypoallergenic detergent. Avoid harsh chemicals.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Acne-prone Skin</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Wash after every use. Use antibacterial detergent. Keep face towels separate.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Dry Skin</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Wash every 3-4 uses. Use gentle detergent. Choose soft, plush towels.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Normal Skin</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Wash every 3-4 uses. Standard detergent is fine. Regular care routine.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10">
              <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">
                Environment Best Practices
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Bathroom</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Hang to dry between uses. Ensure good ventilation. Store in dry area.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Gym Bag</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Remove immediately after gym. Wash as soon as possible. Use antimicrobial spray.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">Shared Bathroom</h4>
                  <p className="text-sm text-[#8B8B8B]">
                    Use personal hooks. Wash more frequently. Consider color coding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Signs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10">
              <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">Mood Status Guide</h3>
              <div className="flex flex-col gap-4">
                {moodLevels.map((mood, i) => (
                  <div key={mood.name}>
                    <div className="flex items-start gap-4">
                      <TowelAvatar src={mood.img} size={80} />
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-medium text-[#4A4A4A] m-0">{mood.name}</p>
                          <span
                            className="text-[11px] font-medium px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: mood.badgeBg, color: mood.badgeText }}
                          >
                            {mood.range}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#8B8B8B] leading-snug m-0">
                          {mood.description}
                        </p>
                      </div>
                    </div>
                    {i < moodLevels.length - 1 && (
                      <div className="h-px bg-[#5A9E8C]/10 ml-[96px] mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5A9E8C]/10">
              <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">
                What You Should Do
              </h3>
              <div className="space-y-4">
                {moodLevels.map((mood) => (
                  <div key={`action-${mood.name}`}>
                    <h4 className="text-sm font-medium text-[#5A9E8C] mb-2">
                      When {mood.name}
                    </h4>
                    <p className="text-sm text-[#8B8B8B] leading-snug">{mood.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
