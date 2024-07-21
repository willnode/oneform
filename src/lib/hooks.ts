import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
  apply: () => void;
}

interface useThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    function (set, get) {
      function applyEffect(isOpen: boolean) {
        // console.log(isOpen)
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
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        set({ theme: get().theme == 'light' ? 'dark' : 'light' });
      }
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage)
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