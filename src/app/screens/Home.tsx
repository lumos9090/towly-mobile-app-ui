import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, AlertCircle } from 'lucide-react';
import { useTowels } from '../context/TowelContext';
import { CircularProgress } from '../components/CircularProgress';

// Mood derived from hygiene % — matches the 4-level system used in Care/Signs
function getMood(percentage: number) {
  if (percentage >= 70) {
    return { name: 'Fresh & Chill', img: '/avatars/towel-fresh.png' };
  }
  if (percentage >= 45) {
    return { name: 'Getting Warm', img: '/avatars/towel-warm.png' };
  }
  if (percentage >= 20) {
    return { name: 'Wet Dog Energy', img: '/avatars/towel-wet.png' };
  }
  return { name: 'Retirement Time', img: '/avatars/towel-retired.png' };
}

// Mascot avatar — clean character image, no cropping
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

export function Home() {
  const navigate = useNavigate();
  const { towels, useTowel, washTowel, sosTowel } = useTowels();
  const [showSOS, setShowSOS] = useState<string | null>(null);

  const handleSOS = (
    towelId: string,
    stainType: 'Blood' | 'Coffee' | 'Makeup' | 'Moisture'
  ) => {
    sosTowel(towelId, stainType);
    setShowSOS(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-4">
      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-medium text-[#4A4A4A]">My Towels</h1>
          <button
            onClick={() => navigate('/add-towel')}
            className="w-12 h-12 rounded-full bg-[#5A9E8C] flex items-center justify-center shadow-md hover:bg-[#4F8C7B] transition-colors"
          >
            <Plus size={24} color="white" strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-4">
          {towels.map((towel) => {
            const mood = getMood(towel.hygienePercentage);
            return (
              <div
                key={towel.id}
                onClick={() => navigate(`/towel/${towel.id}`)}
                className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-5">
                    <CircularProgress
                      percentage={towel.hygienePercentage}
                      size={90}
                      strokeWidth={7}
                      showLabel
                    />
                  </div>
                  <div className="flex-1" />
                  <MoodAvatar src={mood.img} size={100} />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#4A4A4A] mb-1">
                    {towel.name}
                  </h3>
                  <p className="text-sm text-[#8B8B8B]">{mood.name}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      useTowel(towel.id);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#5A9E8C] text-white font-medium text-sm hover:bg-[#4F8C7B] transition-colors"
                  >
                    USED
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      washTowel(towel.id);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#E8F5F1] text-[#5A9E8C] font-medium text-sm hover:bg-[#D4E8E0] transition-colors"
                  >
                    WASHED
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSOS(towel.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#FFF5F0] text-[#F2B894] font-medium text-sm hover:bg-[#FFE8DD] transition-colors flex items-center"
                  >
                    <AlertCircle size={16} className="mr-1" />
                    SOS
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {towels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8B8B8B] mb-4">No towels added yet</p>
            <button
              onClick={() => navigate('/add-towel')}
              className="px-6 py-3 rounded-xl bg-[#5A9E8C] text-white font-medium hover:bg-[#4F8C7B] transition-colors"
            >
              Add Your First Towel
            </button>
          </div>
        )}
      </div>

      {showSOS && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
          onClick={() => setShowSOS(null)}
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
                    onClick={() => handleSOS(showSOS, stain)}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F4] text-[#4A4A4A] font-medium text-sm hover:bg-[#E8F5F1] transition-colors"
                  >
                    {stain}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setShowSOS(null)}
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
