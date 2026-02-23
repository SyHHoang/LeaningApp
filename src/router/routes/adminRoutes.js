export default [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/layouts/adminLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'ExamManager' },
      },
      {
        path: 'exams',
        name: 'ExamManager',
        component: () => import('@/pages/adminPages/examManage/examManager.vue'),
      },
      {
        path: 'exams/add',
        name: 'AddExam',
        component: () => import('@/pages/adminPages/examManage/addExam.vue'),
      },
      {
        path: 'exams/:id/edit',
        name: 'EditExam',
        component: () => import('@/pages/adminPages/examManage/editExam.vue'),
      },
    ],
  },
]
