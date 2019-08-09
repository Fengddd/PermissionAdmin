// layout
import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      {
        path: '/index',
        name: 'index',
        meta,
        component: () => import('@/pages/index')
      },
      {
        path: '/AssignUser',
        name: 'AssignUser',
        component: () => import('@/pages/User/AssignUser'),
        meta: { meta, title: '分配用户角色' }
      },
      {
        path: '/UserGroup',
        name: 'UserGroup',
        component: () => import('@/pages/User/UserGroup'),
        meta: { meta, title: '用户组管理' }
      },
        {
            path: '/User',
            name: 'User',
            component: () => import('../pages/UserRightsModule/User/User.vue'),
            meta: { meta, title: '用户管理' }
        },
        {
            path: '/AssignUserGroup',
            name: 'AssignUserGroup',
            component: () => import('@/pages/User/AssignUserGroup'),
            meta: { meta, title: '用户用户组' }
        },
        {
            path: '/AssignRole',
            name: 'AssignRole',
            component: () => import('@/pages/User/AssignRole'),
            meta: { meta, title: '用户角色' }
        },
        {
            path: '/Role',
            name: 'Role',
            component: () => import('@/pages/UserRightsModule/Role/Role'),
            meta: { meta, title: '角色管理' }
        },
        {
            path: '/AssignGroupRole',
            name: 'AssignGroupRole',
            component: () => import('@/pages/User/AssignGroupRole'),
            meta: { meta, title: '用户组角色' }
        },
        {
            path: '/AssignRoleMenu',
            name: 'AssignRoleMenu',
            component: () => import('@/pages/User/AssignRoleMenu'),
            meta: { meta, title: '分配角色菜单' }
        }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登陆
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/error-page-404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
