import _import from '@/utils/import'
const Layout = _import('layout/Layout')

export const asyncRouterMap = [
  // 用户管理
  {
    path: '/management',
    component: Layout,
    meta: {
      roles: ['teacher']
    },
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
    meta: {
      title: '请假管理',
      icon: 'leave'
    },
    children: [
      {
        path: 'index',
        component: _import('leave/index'),
        name: 'leave',
        meta: {
          roles: ['stu'],
          title: 'leave',
          icon: 'leave'
        }
      },
      {
        path: 'list',
        component: _import('leave/list'),
        name: 'leaveList',
        meta: {
          roles: ['teacher'],
          title: 'leave',
          icon: 'leaveList'
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
      icon: 'attendance',
      roles: ['teacher']
    },
    children: [
      {
        path: 'index',
        component: _import('attendance/index'),
        name: 'attendance',
        meta: {
          title: '课堂考勤',
          icon: 'attendance'
        }
      },
      {
        path: 'attendances',
        component: _import('attendance/attendances'),
        name: 'attendances',
        meta: {
          title: '考勤记录',
          icon: 'attendance'
        }
        // },
        // {
        //   path: 'infoCount',
        //   component: _import('attendance/infoCount'),
        //   name: 'infoCount',
        //   meta: {
        //     title: '考勤统计',
        //     icon: 'attendance'
        //   }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
