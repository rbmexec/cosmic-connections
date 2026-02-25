"use client";

import { Suspense, type ComponentType, type ReactNode } from "react";
import { FullScreenOverlay } from "@/components/ui";
import { useOverlay } from "@/lib/overlay-context";

type OverlayVariant = "standard" | "fullscreen";

interface OverlayRegistration {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  title?: string;
  titleIcon?: ReactNode;
  variant?: OverlayVariant;
}

const registry = new Map<string, OverlayRegistration>();

export function registerOverlay(id: string, reg: OverlayRegistration) {
  registry.set(id, reg);
}

interface OverlayOutletProps {
  /** Extra props passed through to every overlay component */
  sharedProps?: Record<string, unknown>;
}

export default function OverlayOutlet({ sharedProps = {} }: OverlayOutletProps) {
  const { openOverlays, closeOverlay } = useOverlay();

  return (
    <>
      {Array.from(registry.entries()).map(([id, reg]) => {
        const isOpen = openOverlays.has(id);
        const overlayProps = openOverlays.get(id) ?? {};
        const Component = reg.component;

        return (
          <FullScreenOverlay
            key={id}
            open={isOpen}
            onClose={() => closeOverlay(id)}
            title={reg.title}
            titleIcon={reg.titleIcon}
            variant={reg.variant}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <Component
                {...sharedProps}
                {...overlayProps}
                onClose={() => closeOverlay(id)}
              />
            </Suspense>
          </FullScreenOverlay>
        );
      })}
    </>
  );
}
