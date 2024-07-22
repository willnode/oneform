import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';
import CookieStorage from './cookie';

interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
  apply: () => void;
}

interface useThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
  apply: () => void;
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    function (set, get) {
      function applyEffect(isOpen: boolean) {
        // let main = document.getElementById('main');
        // if (!main) return;
        // if (isOpen) {
        //   main.classList.remove('lg:ml-[90px]');
        //   main.classList.add('lg:ml-72');
        // } else {
        //   main.classList.add('lg:ml-[90px]');
        //   main.classList.remove('lg:ml-72');
        // }
        // requestAnimationFrame(() => main.classList.add('transition-[margin-left]'));
      }
      return ({
        isOpen: true,
        setIsOpen: () => {
          applyEffect(!get().isOpen);
          set({ isOpen: !get().isOpen });
        },
        apply: () => applyEffect((get() || { isOpen: true }).isOpen)
      })
    },
    {
      name: 'sidebarOpen',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => state?.apply();
      }
    }
  )
);

export const useTheme = create(
  persist<useThemeStore>(
    function (set, get) {
      function applyEffect(theme: string) {
        let main = document.documentElement;
        if (!main) return;
        if (theme == 'light') {
          main.classList.remove('dark');
          main.classList.add('light');
        } else {
          main.classList.remove('light');
          main.classList.add('dark');
        }
      }
      return ({
        theme: 'light',
        toggleTheme: () => {
          let theme: "light" | "dark" = get().theme == 'light' ? 'dark' : 'light';
          applyEffect(theme);
          set({ theme });
        },
        apply: () => applyEffect((get() || { theme: 'light' }).theme)
      })
    },
    {
      name: 'theme',
      storage: createJSONStorage(() => CookieStorage('theme')),
      onRehydrateStorage: () => {
        return (state) => state?.apply();
      }
    }
  )
);


export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};