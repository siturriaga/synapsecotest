import {
  AnchorHTMLAttributes,
  Children,
  ReactElement,
  ReactNode,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type RouterValue = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error("Router context unavailable. Wrap in <BrowserRouter>.");
  }
  return ctx;
}

function getInitialPath() {
  if (typeof window === "undefined" || !window.location?.pathname) {
    return "/";
  }
  return window.location.pathname || "/";
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => getInitialPath());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPopState = () => setPath(getInitialPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback(
    (to: string) => {
      if (typeof window === "undefined") return;
      const normalized = normalizePath(to);
      if (normalized === normalizePath(path)) return;
      window.history.pushState(null, "", normalized);
      setPath(normalized);
    },
    [path]
  );

  const value = useMemo<RouterValue>(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

type RouteProps = {
  path: string;
  element: ReactNode;
};

export function Route(_: RouteProps) {
  return null;
}

export function Routes({ children }: { children: ReactNode }) {
  const { path } = useRouter();
  const list = Children.toArray(children);
  let fallback: ReactElement<RouteProps> | null = null;

  for (const child of list) {
    if (!isValidElement<RouteProps>(child)) continue;
    const routePath = child.props.path;
    if (routePath === "*") {
      fallback = child;
      continue;
    }
    if (matches(routePath, path)) {
      return <>{child.props.element}</>;
    }
  }

  return fallback ? <>{fallback.props.element}</> : null;
}

type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children: ReactNode;
};

export function NavLink({ to, children, className, onClick, ...rest }: NavLinkProps) {
  const { navigate, path } = useRouter();
  const normalizedTo = normalizePath(to);
  const isActive = matches(normalizedTo, path);
  const computedClass = [className, isActive ? "active" : ""]
    .filter(Boolean)
    .join(" ")
    .trim();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      (rest.target && rest.target !== "_self") ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(normalizedTo);
  }

  return (
    <a
      {...rest}
      href={normalizedTo}
      className={computedClass || undefined}
      aria-current={isActive ? "page" : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

function matches(pattern: string, pathname: string) {
  if (pattern === "*") return true;
  return normalizePath(pattern) === normalizePath(pathname);
}

function normalizePath(path: string) {
  if (!path) return "/";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  if (trimmed.length > 1 && trimmed.endsWith("/")) {
    return trimmed.slice(0, -1);
  }
  return trimmed;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function useLocation() {
  const { path } = useRouter();
  return { pathname: path };
}
