import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const blockRoot = "bjork-block @container font-sans antialiased";

export function focusRing(className?: string) {
  return cn(
    "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bjork-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bjork-ring-offset)]",
    className,
  );
}

export type AppBlockTheme = "light" | "dark" | "auto";

export function useAppBlockTheme(theme: AppBlockTheme) {
  const [resolved, setResolved] = useState<"light" | "dark">(
    theme === "auto" ? "light" : theme,
  );

  useEffect(() => {
    if (theme !== "auto") {
      setResolved(theme);
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setResolved(mq.matches ? "dark" : "light");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [theme]);

  return {
    style: { colorScheme: resolved },
  };
}

export function useBlockReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

export function useElementWidth(ref: React.RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return width;
}

export function useAnnouncer() {
  const [message, setMessage] = useState("");
  const announce = useCallback((msg: string) => {
    setMessage("");
    requestAnimationFrame(() => setMessage(msg));
  }, []);
  const region = (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
  return { announce, region };
}

export interface BlockButtonProps
  extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}

export const BlockButton = forwardRef<
  ElementRef<"button">,
  BlockButtonProps
>(({ variant = "primary", size = "md", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors duration-150",
        variant === "primary" &&
          "bg-[var(--bjork-accent)] text-[color:var(--bjork-accent-foreground)] hover:bg-[var(--bjork-accent-hover)] disabled:opacity-50",
        variant === "secondary" &&
          "border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] text-[color:var(--bjork-text)] shadow-[var(--bjork-shadow-soft)] hover:bg-[var(--bjork-surface-hover)] disabled:opacity-50",
        size === "sm" && "h-8 px-3 text-[13px]",
        size === "md" && "h-9 px-4 text-[14px]",
        focusRing(),
        className,
      )}
      {...props}
    />
  );
});
BlockButton.displayName = "BlockButton";

export interface IconButtonProps extends ComponentPropsWithoutRef<"button"> {
  label: string;
  size?: "sm" | "md";
  pressed?: boolean;
}

export const IconButton = forwardRef<ElementRef<"button">, IconButtonProps>(
  ({ label, size = "md", pressed, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-[9px] text-[color:var(--bjork-text-medium)] transition-colors duration-150 hover:bg-[var(--bjork-surface-hover)] hover:text-[color:var(--bjork-text)] disabled:opacity-50 [&>svg]:size-[17px]",
          size === "sm" && "size-7",
          size === "md" && "size-8",
          focusRing(),
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] px-1 font-mono text-[11px] text-[color:var(--bjork-text-soft)] shadow-[var(--bjork-shadow-soft)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function InitialsAvatar({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const hue = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
  }, [name]);
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `hsl(${hue} 45% 50%)`,
        color: "#fff",
      }}
    >
      {initials}
    </span>
  );
}

const DrawerContext = createContext<{
  open: boolean;
  onClose: () => void;
} | null>(null);

export function BlockDrawer({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <DrawerContext.Provider value={{ open, onClose }}>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={id}
          className="relative z-10 flex w-[260px] flex-col border-r border-[color:var(--bjork-border)] bg-[var(--bjork-panel)] shadow-2xl"
        >
          <h2 id={id} className="sr-only">
            {label}
          </h2>
          {children}
        </aside>
      </div>
    </DrawerContext.Provider>
  );
}
