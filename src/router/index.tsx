import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

// Lazy-load pages
const CharactersPage = lazy(() => import('../pages/CharactersPage'))
const CharacterDetailPage = lazy(() => import('../pages/CharacterDetailPage'))

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='text-center p-4'>
        <h1>EY Assignment Project</h1>
        <hr className='my-4' />
        <Outlet />
      </div>
    </Suspense>
  ),
})

const charactersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CharactersPage,
})

const characterDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$id',
  component: CharacterDetailPage,
})

const routeTree = rootRoute.addChildren([
  charactersRoute,
  characterDetailRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
