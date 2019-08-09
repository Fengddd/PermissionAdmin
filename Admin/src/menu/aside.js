// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/User', title: '用户管理' },
        {path: '/UserGroup', title: '用户组管理' },
        { path: '/AssignUser', title: '分配用户角色' },
        { path: '/AssignUserGroup', title: '用户用户组' },
        { path: '/AssignRole', title: '用户角色' },
        { path: '/Role', title: '角色管理' },
        { path: '/AssignGroupRole', title: '用户组角色' },
        { path: '/AssignRoleMenu', title: '分配角色菜单' },
        { path: '/userDemo', title: '用户测试' }
    ]
  }
]
