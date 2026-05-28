import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useTowels } from '../context/TowelContext';

const AVATAR_COLORS = [
  '#A8D5C5',
  '#B8D8E8',
  '#F5D4C1',
  '#E8DDD3',
  '#C5E1D7',
  '#D4C5E8',
  '#F5C1D4',
  '#C1E1F5',
];

const ENVIRONMENTS = [
  {
    value: 'Home Bathroom' as const,
    title: 'Home Bathroom',
    description: 'Moderate humidity',
  },
  {
    value: 'Gym Bag' as const,
    title: 'Gym Bag',
    description: 'High humidity',
  },
  {
    value: 'Shared Bathroom' as const,
    title: 'Shared Bathroom',
    description: 'Higher exposure',
  },
  {
    value: 'Kitchen' as const,
    title: 'Kitchen',
    description: 'Contamination risk',
  },
  {
    value: 'Personal Care' as const,
    title: 'Personal Care',
    description: 'Face / skincare',
  },
  {
    value: 'Travel / Outdoor' as const,
    title: 'Travel / Outdoor',
    description: 'Stays damp longer',
  },
];

const TYPES = [
  'Face',
  'Body',
  'Hand',
  'Hair',
  'Bath',
  'Baby',
  'Beach',
  'Sport',
  'Kitchen',
  'Pet',
] as const;

const SENSITIVITIES = ['Normal', 'Sensitive', 'Acne-prone', 'Dry'] as const;

export function AddTowel() {
  const navigate = useNavigate();
  const { addTowel } = useTowels();

  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [type, setType] = useState<(typeof TYPES)[number]>('Body');
  const [skinSensitivity, setSkinSensitivity] =
    useState<(typeof SENSITIVITIES)[number]>('Normal');
  const [environment, setEnvironment] =
    useState<(typeof ENVIRONMENTS)[number]['value']>('Home Bathroom');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addTowel({
        name: name.trim(),
        avatarColor,
        type,
        skinSensitivity,
        environment,
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4]">
      <div className="max-w-md mx-auto px-4 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
          >
            <ChevronLeft size={22} color="#4A4A4A" />
          </button>
          <h1 className="text-xl font-medium text-[#4A4A4A]">
            Add a new towel
          </h1>
        </div>

        {/* Live preview card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5A9E8C]/10 mb-4 flex items-center gap-4">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                backgroundColor: '#FAF7F4',
                border: '1px solid rgba(90, 158, 140, 0.1)',
                overflow: 'hidden',
              }}
            >
              <img
                src="/avatars/towel-fresh.png"
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: -3,
                right: -3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: avatarColor,
                border: '2.5px solid white',
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#8B8B8B] m-0 mb-0.5">Preview</p>
            <h3
              className="text-base font-medium text-[#4A4A4A] m-0 mb-1.5"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name || 'Your new towel'}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-lg"
                style={{ backgroundColor: '#E1F5EE', color: '#4A6E4A' }}
              >
                Fresh &amp; Chill
              </span>
              <span
                className="inline-block text-[11px] px-2 py-0.5 rounded-lg"
                style={{ backgroundColor: '#F1EFE8', color: '#5F5E5A' }}
              >
                {type} · {skinSensitivity}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-1.5">
              Towel name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Face Towel"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#5A9E8C]/15 text-sm text-[#4A4A4A] placeholder:text-[#8B8B8B] focus:outline-none focus:ring-2 focus:ring-[#5A9E8C]/30"
              required
            />
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className="rounded-full transition-all"
                  style={{
                    width: 34,
                    height: 34,
                    backgroundColor: color,
                    border:
                      avatarColor === color
                        ? '2.5px solid #5A9E8C'
                        : '2.5px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-2">
              Type
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3.5 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    type === t
                      ? 'bg-[#5A9E8C] text-white'
                      : 'bg-white text-[#4A4A4A] border border-[#5A9E8C]/15'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Skin sensitivity */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-2">
              Skin sensitivity
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {SENSITIVITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkinSensitivity(s)}
                  className={`px-3.5 py-1.5 rounded-full font-medium text-xs transition-colors ${
                    skinSensitivity === s
                      ? 'bg-[#5A9E8C] text-white'
                      : 'bg-white text-[#4A4A4A] border border-[#5A9E8C]/15'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Environment */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#4A4A4A] mb-2">
              Environment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ENVIRONMENTS.map((env) => {
                const selected = environment === env.value;
                return (
                  <button
                    key={env.value}
                    type="button"
                    onClick={() => setEnvironment(env.value)}
                    className={`px-3 py-3 rounded-2xl text-left transition-colors ${
                      selected
                        ? 'bg-[#5A9E8C] text-white'
                        : 'bg-white text-[#4A4A4A] border border-[#5A9E8C]/15'
                    }`}
                  >
                    <div className="text-[13px] font-medium mb-0.5 leading-tight">
                      {env.title}
                    </div>
                    <div
                      className="text-[11px] leading-tight"
                      style={{
                        color: selected ? 'rgba(255,255,255,0.75)' : '#8B8B8B',
                      }}
                    >
                      {env.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky save button */}
          <div
            className="sticky bottom-0 pt-4 pb-1"
            style={{
              background:
                'linear-gradient(to bottom, rgba(250, 247, 244, 0), #FAF7F4 25%)',
            }}
          >
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full px-6 py-3.5 rounded-2xl bg-[#5A9E8C] text-white font-medium text-sm hover:bg-[#4F8C7B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Add Towel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
