import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'

interface LocationValue {
  pathname: string
  search: string
}

interface RouterContextValue extends LocationValue {
  params: Record<string, string>
  outlet: ReactNode
  navigate: (to: string, options?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterContextValue | null>(null)

function normalizeTarget(target: string): string {
  const value = target.startsWith('#') ? target.slice(1) : target
  if (!value || value === '/') return '/'
  return value.startsWith('/') ? value : `/${value}`
}

function parseHash(): LocationValue {
  const target = normalizeTarget(window.location.hash)
  const question = target.indexOf('?')
  if (question === -1) return { pathname: target, search: '' }
  return { pathname: target.slice(0, question) || '/', search: target.slice(question) }
}

function setHash(to: string, replace = false): void {
  const target = normalizeTarget(to)
  const hash = `#${target}`
  if (replace) {
    const next = `${window.location.pathname}${window.location.search}${hash}`
    window.history.replaceState(null, '', next)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else if (window.location.hash !== hash) {
    window.location.hash = target
  }
}

export function HashRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationValue>(() => parseHash())

  useEffect(() => {
    const update = () => setLocation(parseHash())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  const value = useMemo<RouterContextValue>(() => ({
    ...location,
    params: {},
    outlet: null,
    navigate: (to, options) => setHash(to, options?.replace),
  }), [location])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

function useRouter(): RouterContextValue {
  const value = useContext(RouterContext)
  if (!value) throw new Error('Router hooks must be used inside HashRouter.')
  return value
}

export interface RouteProps {
  path?: string
  index?: boolean
  element: ReactNode
  children?: ReactNode
}

export function Route(_props: RouteProps): null {
  return null
}

interface MatchResult {
  element: ReactNode
  params: Record<string, string>
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  if (pattern === '*') return {}
  const normalizedPattern = normalizeTarget(pattern).replace(/\/$/, '') || '/'
  const normalizedPath = normalizeTarget(pathname).replace(/\/$/, '') || '/'
  const patternParts = normalizedPattern === '/' ? [] : normalizedPattern.slice(1).split('/')
  const pathParts = normalizedPath === '/' ? [] : normalizedPath.slice(1).split('/')
  if (patternParts.length !== pathParts.length) return null

  const params: Record<string, string> = {}
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index]
    const actual = pathParts[index]
    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual)
    } else if (expected !== actual) {
      return null
    }
  }
  return params
}

function routeElements(children: ReactNode): ReactElement<RouteProps>[] {
  return Children.toArray(children).filter(
    (child): child is ReactElement<RouteProps> => isValidElement<RouteProps>(child) && child.type === Route,
  )
}

function findMatch(children: ReactNode, pathname: string): MatchResult | null {
  for (const route of routeElements(children)) {
    const { path, index, element, children: nested } = route.props

    if (path === undefined && !index) {
      const childMatch = findMatch(nested, pathname)
      if (childMatch) {
        return {
          params: childMatch.params,
          element: <RouteFrame params={childMatch.params} outlet={childMatch.element}>{element}</RouteFrame>,
        }
      }
      continue
    }

    if (index) {
      if (pathname === '/') return { element, params: {} }
      continue
    }

    const params = matchPath(path ?? '*', pathname)
    if (params) return { element, params }
  }
  return null
}

function RouteFrame({ params, outlet, children }: { params: Record<string, string>; outlet: ReactNode; children: ReactNode }) {
  const parent = useRouter()
  const value = useMemo<RouterContextValue>(() => ({ ...parent, params, outlet }), [outlet, params, parent])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function Routes({ children }: { children: ReactNode }) {
  const router = useRouter()
  const match = useMemo(() => findMatch(children, router.pathname), [children, router.pathname])
  if (!match) return null
  return <RouteFrame params={match.params} outlet={null}>{match.element}</RouteFrame>
}

export function Outlet() {
  return <>{useRouter().outlet}</>
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const navigate = useNavigate()
  useEffect(() => navigate(to, { replace }), [navigate, replace, to])
  return null
}

export function useNavigate() {
  return useRouter().navigate
}

export function useLocation(): LocationValue {
  const { pathname, search } = useRouter()
  return { pathname, search }
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  return useRouter().params as T
}

export function useSearchParams(): [URLSearchParams] {
  const { search } = useRouter()
  return useMemo(() => [new URLSearchParams(search)], [search])
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

export function Link({ to, children, ...props }: LinkProps) {
  return <a href={`#${normalizeTarget(to)}`} {...props}>{children}</a>
}

interface NavLinkState {
  isActive: boolean
}

interface NavLinkProps extends Omit<LinkProps, 'className'> {
  end?: boolean
  className?: string | ((state: NavLinkState) => string)
}

export function NavLink({ to, end = false, className, children, ...props }: NavLinkProps) {
  const { pathname } = useLocation()
  const targetPath = normalizeTarget(to).split('?')[0]
  const isActive = end || targetPath === '/' ? pathname === targetPath : pathname === targetPath || pathname.startsWith(`${targetPath}/`)
  const resolvedClass = typeof className === 'function' ? className({ isActive }) : className
  return <Link to={to} className={resolvedClass} aria-current={isActive ? 'page' : undefined} {...props}>{children}</Link>
}

export function RouterTestHarness({ path = '/', children }: { path?: string; children: ReactNode }) {
  const [pathname, search = ''] = normalizeTarget(path).split('?')
  const value = useMemo<RouterContextValue>(() => ({
    pathname,
    search: search ? `?${search}` : '',
    params: {},
    outlet: null,
    navigate: () => undefined,
  }), [pathname, search])
  return <RouterContext.Provider value={value}>{cloneElement(children as ReactElement)}</RouterContext.Provider>
}
