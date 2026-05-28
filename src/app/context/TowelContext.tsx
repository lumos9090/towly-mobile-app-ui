import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Towel {
  id: string;
  name: string;
  avatarColor: string;
  type: 'Face' | 'Body' | 'Hand' | 'Hair' | 'Bath' | 'Baby' | 'Beach' | 'Sport' | 'Kitchen' | 'Pet';
  skinSensitivity: 'Normal' | 'Sensitive' | 'Acne-prone' | 'Dry';
  environment: 'Home Bathroom' | 'Gym Bag' | 'Shared Bathroom' | 'Kitchen' | 'Personal Care' | 'Travel / Outdoor';
  hygienePercentage: number;
  daysUsed: number;
  lastWashed: Date;
  totalUses: number;
  totalWashes: number;
  usageHistory: { date: string; used: boolean; washed: boolean }[];
}

interface TowelContextType {
  towels: Towel[];
  addTowel: (towel: Omit<Towel, 'id' | 'hygienePercentage' | 'daysUsed' | 'lastWashed' | 'totalUses' | 'totalWashes' | 'usageHistory'>) => void;
  updateTowel: (id: string, updates: Partial<Towel>) => void;
  useTowel: (id: string) => void;
  washTowel: (id: string) => void;
  sosTowel: (id: string, stainType: 'Blood' | 'Coffee' | 'Makeup' | 'Moisture') => void;
}

const TowelContext = createContext<TowelContextType | undefined>(undefined);

export function TowelProvider({ children }: { children: ReactNode }) {
  const [towels, setTowels] = useState<Towel[]>([
    {
      id: '1',
      name: 'Morning Face',
      avatarColor: '#A8D5C5',
      type: 'Face',
      skinSensitivity: 'Sensitive',
      environment: 'Personal Care',
      hygienePercentage: 78,
      daysUsed: 2,
      lastWashed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      totalUses: 45,
      totalWashes: 22,
      usageHistory: generateUsageHistory(45, 22),
    },
    {
      id: '2',
      name: 'Main Bath',
      avatarColor: '#B8D8E8',
      type: 'Body',
      skinSensitivity: 'Normal',
      environment: 'Home Bathroom',
      hygienePercentage: 92,
      daysUsed: 1,
      lastWashed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      totalUses: 32,
      totalWashes: 31,
      usageHistory: generateUsageHistory(32, 31),
    },
    {
      id: '3',
      name: 'Gym Essential',
      avatarColor: '#F5D4C1',
      type: 'Body',
      skinSensitivity: 'Normal',
      environment: 'Gym Bag',
      hygienePercentage: 45,
      daysUsed: 4,
      lastWashed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      totalUses: 28,
      totalWashes: 14,
      usageHistory: generateUsageHistory(28, 14),
    },
  ]);

  const addTowel = (towelData: Omit<Towel, 'id' | 'hygienePercentage' | 'daysUsed' | 'lastWashed' | 'totalUses' | 'totalWashes' | 'usageHistory'>) => {
    const newTowel: Towel = {
      ...towelData,
      id: Date.now().toString(),
      hygienePercentage: 100,
      daysUsed: 0,
      lastWashed: new Date(),
      totalUses: 0,
      totalWashes: 1,
      usageHistory: [],
    };
    setTowels([...towels, newTowel]);
  };

  const updateTowel = (id: string, updates: Partial<Towel>) => {
    setTowels(towels.map(towel =>
      towel.id === id ? { ...towel, ...updates } : towel
    ));
  };

  const useTowel = (id: string) => {
    setTowels(towels.map(towel => {
      if (towel.id === id) {
        const newDaysUsed = towel.daysUsed + 1;
        const newHygiene = Math.max(0, towel.hygienePercentage - 12);
        const today = new Date().toISOString().split('T')[0];

        return {
          ...towel,
          daysUsed: newDaysUsed,
          hygienePercentage: newHygiene,
          totalUses: towel.totalUses + 1,
          usageHistory: [
            ...towel.usageHistory,
            { date: today, used: true, washed: false }
          ],
        };
      }
      return towel;
    }));
  };

  const washTowel = (id: string) => {
    setTowels(towels.map(towel => {
      if (towel.id === id) {
        const today = new Date().toISOString().split('T')[0];

        return {
          ...towel,
          daysUsed: 0,
          hygienePercentage: 100,
          lastWashed: new Date(),
          totalWashes: towel.totalWashes + 1,
          usageHistory: [
            ...towel.usageHistory,
            { date: today, used: false, washed: true }
          ],
        };
      }
      return towel;
    }));
  };

  const sosTowel = (id: string, stainType: 'Blood' | 'Coffee' | 'Makeup' | 'Moisture') => {
    const stainImpact = {
      'Blood': 25,
      'Coffee': 15,
      'Makeup': 18,
      'Moisture': 20,
    };

    setTowels(towels.map(towel => {
      if (towel.id === id) {
        const newHygiene = Math.max(0, towel.hygienePercentage - stainImpact[stainType]);
        return {
          ...towel,
          hygienePercentage: newHygiene,
        };
      }
      return towel;
    }));
  };

  return (
    <TowelContext.Provider value={{ towels, addTowel, updateTowel, useTowel, washTowel, sosTowel }}>
      {children}
    </TowelContext.Provider>
  );
}

export function useTowels() {
  const context = useContext(TowelContext);
  if (!context) {
    throw new Error('useTowels must be used within TowelProvider');
  }
  return context;
}

function generateUsageHistory(totalUses: number, totalWashes: number) {
  const history = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const random = Math.random();
    if (random > 0.7) {
      history.push({ date: dateStr, used: true, washed: false });
    } else if (random > 0.85) {
      history.push({ date: dateStr, used: false, washed: true });
    }
  }

  return history;
}
