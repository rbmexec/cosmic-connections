"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type OverlayProps = Record<string, unknown>;

interface OverlayContextValue {
  openOverlay: (id: string, props?: OverlayProps) => void;
  closeOverlay: (id: string) => void;
  isOpen: (id: string) => boolean;
  getProps: (id: string) => OverlayProps;
  openOverlays: Map<string, OverlayProps>;
}

const OverlayContext = createContext<OverlayContextValue>({
  openOverlay: () => {},
  closeOverlay: () => {},
  isOpen: () => false,
  getProps: () => ({}),
  openOverlays: new Map(),
});

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlays, setOverlays] = useState<Map<string, OverlayProps>>(
    () => new Map()
  );

  const openOverlay = useCallback((id: string, props: OverlayProps = {}) => {
    setOverlays((prev) => {
      const next = new Map(prev);
      next.set(id, props);
      return next;
    });
  }, []);

  const closeOverlay = useCallback((id: string) => {
    setOverlays((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isOpen = useCallback(
    (id: string) => overlays.has(id),
    [overlays]
  );

  const getProps = useCallback(
    (id: string) => overlays.get(id) ?? {},
    [overlays]
  );

  return (
    <OverlayContext.Provider
      value={{ openOverlay, closeOverlay, isOpen, getProps, openOverlays: overlays }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  return useContext(OverlayContext);
}
