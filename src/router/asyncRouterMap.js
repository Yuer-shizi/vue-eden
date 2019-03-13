import _import from '@/utils/import'
const Layout = _import('layout/Layout')

export const asyncRouterMap = [
  // 用户管理
  {
    path: '/management',
    component: Layout,
    children: [
      {
        path: 'index',
        component: _import('management/index'),
        name: 'management',
        meta: {
          title: 'management',
          icon: 'management'
        }
      }
    ]
  },
  // 请假管理
  {
    path: '/leave',
    component: Layout,
    children: [
      {
        path: 'index',
        component: _import('leave/index'),
        name: 'leave',
        meta: {
          title: 'leave',
          icon: 'leave'
        }
      }
    ]
  },
  // 考勤管理
  {
    path: '/attendance',
    component: Layout,
    meta: {
      title: '考勤管理',
      icon: 'attendance'
    },
    children: [
      {
        path: 'index',
        component: _import('attendance/index'),
        name: 'attendance1',
        meta: {
          title: 'attendance',
          icon: 'attendance'
        }
      },
      {
        path: 'index',
        component: _import('attendance/index'),
        name: 'attendance2',
        meta: {
          title: 'attendance',
          icon: 'attendance'
        }
      },
      {
        path: 'index',
        component: _import('attendance/index'),
        name: 'attendance3',
        meta: {
          title: 'attendance',
          icon: 'attendance'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
