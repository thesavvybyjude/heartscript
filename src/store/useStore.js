import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { encryptMessage } from '../utils/crypto';

const useStore = create((set, get) => {
  return {
    // Auth - Supabase
    user: null,
    isInitializing: true,

    initializeAuth: () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          set({ user: { id: session.user.id, email: session.user.email, ...session.user.user_metadata } });
        }
        set({ isInitializing: false });
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          set({ user: { id: session.user.id, email: session.user.email, ...session.user.user_metadata } });
        } else {
          set({ user: null });
        }
      });
    },

    login: async ({ email, password, isSignUp, username }) => {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username, avatarId: 1 } }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    },

    logout: async () => {
      await supabase.auth.signOut();
    },

    updateProfile: async (updates) => {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      if (!error) {
        set({ user: { ...get().user, ...updates } });
      }
    },

    // HeartScripts - Supabase
    heartscripts: [],
    isLoading: false,

    fetchDashboardScripts: async () => {
      set({ isLoading: true });
      const user = get().user;
      if (!user) return set({ isLoading: false });
      
      const { data, error } = await supabase
        .from('heartscripts')
        .select('*')
        .eq('sender', user.username)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        set({ heartscripts: data });
      }
      set({ isLoading: false });
    },

    createHeartScript: async (hs) => {
      set({ isLoading: true });
      
      let finalContent = hs.content;
      if (hs.is_locked && hs.password) {
        finalContent = await encryptMessage(hs.content, hs.password);
      }
      
      const payload = finalContent + '|||' + (hs.soundscape || 'none');

      const newHs = {
        sender: get().user?.username || 'Anonymous',
        type: hs.type,
        content: payload,
        tone: hs.tone,
        is_locked: hs.is_locked,
        password_hint: hs.password_hint || null,
        expires_at: hs.expires ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
      };

      const { data, error } = await supabase
        .from('heartscripts')
        .insert([newHs])
        .select()
        .single();

      if (!error && data) {
        set(state => ({ heartscripts: [data, ...state.heartscripts] }));
      }
      set({ isLoading: false });
      return data; // Return the created object so Step6 can get the ID
    },

    fetchHeartScript: async (id) => {
      set({ isLoading: true });
      const { data } = await supabase
        .from('heartscripts')
        .select('*')
        .eq('id', id)
        .single();
        
      set({ isLoading: false });
      return data || null;
    },

    addResponse: async (id, response) => {
      const { data, error } = await supabase
        .from('heartscripts')
        .update({ response })
        .eq('id', id)
        .select()
        .single();
        
      if (!error && data) {
        set(state => ({
          heartscripts: state.heartscripts.map(h => h.id === id ? data : h)
        }));
      }
    },
    
    updateOpenedAt: async (id) => {
      await supabase
        .from('heartscripts')
        .update({ opened_at: new Date().toISOString() })
        .eq('id', id)
        .is('opened_at', null);
    },

    revokeHeartScript: async (id) => {
      const { error } = await supabase
        .from('heartscripts')
        .delete()
        .eq('id', id);
        
      if (!error) {
        set(state => ({
          heartscripts: state.heartscripts.filter(h => h.id !== id)
        }));
        return true;
      }
      return false;
    },

    // Wizard state
    wizardStep: 1,
    wizardType: null,
    wizardContent: '',
    wizardTone: null,
    wizardIsLocked: false,
    wizardPassword: '',
    wizardConfirmPassword: '',
    wizardPasswordHint: '',
    wizardCreatedId: null,
    wizardExpires: false,
    wizardSoundscape: 'none',

    setWizardStep: (step) => set({ wizardStep: step }),
    setWizardType: (type) => set({ wizardType: type }),
    setWizardContent: (content) => set({ wizardContent: content }),
    setWizardTone: (tone) => set({ wizardTone: tone }),
    setWizardIsLocked: (locked) => set({ wizardIsLocked: locked }),
    setWizardPassword: (pw) => set({ wizardPassword: pw }),
    setWizardConfirmPassword: (pw) => set({ wizardConfirmPassword: pw }),
    setWizardPasswordHint: (hint) => set({ wizardPasswordHint: hint }),
    setWizardCreatedId: (id) => set({ wizardCreatedId: id }),
    setWizardExpires: (exp) => set({ wizardExpires: exp }),
    setWizardSoundscape: (s) => set({ wizardSoundscape: s }),

    resetWizard: () => set({
      wizardStep: 1,
      wizardType: null,
      wizardContent: '',
      wizardTone: null,
      wizardIsLocked: false,
      wizardPassword: '',
      wizardConfirmPassword: '',
      wizardPasswordHint: '',
      wizardCreatedId: null,
      wizardExpires: false,
      wizardSoundscape: 'none',
    }),
  };
});

export default useStore;
