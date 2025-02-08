import { create } from 'zustand';

type AIState = {
  activeModel: string;
  apiKeys: Record<string, string>;
  setActiveModel: (model: string) => void;
  updateApiKey: (provider: string, key: string) => void;
};

export const useAIStore = create<AIState>((set) => ({
  activeModel: 'together-ai',
  apiKeys: {},
  setActiveModel: (model) => set({ activeModel: model }),
  updateApiKey: (provider, key) => 
    set((state) => ({ apiKeys: { ...state.apiKeys, [provider]: key } })),
}));