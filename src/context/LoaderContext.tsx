import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import Loader from '../components/Loader/Loader';

type LoaderContextValue = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  setLoading: (value: boolean) => void;
};

const LoaderContext = createContext<LoaderContextValue | undefined>(undefined);

type LoaderProviderProps = {
  children: ReactNode;
};

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);
  const setLoading = useCallback((value: boolean) => setIsLoading(value), []);

  const value = useMemo(
    () => ({
      isLoading,
      showLoader,
      hideLoader,
      setLoading,
    }),
    [isLoading, showLoader, hideLoader, setLoading]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <Loader visible={isLoading} />
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }

  return context;
}
