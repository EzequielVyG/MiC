import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const router = useRouter();

  useEffect(() => {
    const getLanguageNavigator = () => {
      if (typeof window !== 'undefined') {
        const userLanguage = navigator.language;
        const languageCode = userLanguage.split('-')[0];
        if (languageCode === 'es' || languageCode === 'en') {
          return languageCode;
        }
      }
      return 'es';
    };

    setSelectedLanguage(getLanguageNavigator());
    router.push(router.pathname, router.pathname, { locale: getLanguageNavigator() });
  }, []);

  const changeLanguage = (newLanguage) => {
    setSelectedLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
