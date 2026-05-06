export default [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/layouts/adminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/pages/adminPages/adminDashboard.vue'),
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
      {
        path:'courses',
        name:'CourseManager',
        component: () => import('@/pages/adminPages/CourseManage/coursesManagePage.vue'),
      },
      {
        path:'courses/:id'
        ,name:'LessonManager',
        component: () => import('@/pages/adminPages/CourseManage/courseDetailPage.vue'),
      },
      {
        path:'courses/:id/add-lesson'
        ,name:'AddLesson',
        component: () => import('@/pages/adminPages/CourseManage/addLessonPage.vue'),
      },
      {
        path:'courses/:id/edit-lesson/:lessonId'
        ,name:'EditLesson',
        component: () => import('@/pages/adminPages/CourseManage/editLessonPage.vue'),
      },
      {
        path:'vocabulary'
        ,name:'Vocabulary',
        component: () => import('@/pages/adminPages/vocabularyManager.vue'),
      },
      {
        path:'flashcards'
        ,name:'Flashcards',
        component: () => import('@/pages/adminPages/flashCard/flashCardListManage.vue'),
      },
      {
        path:'flashcards/:id'
        ,name:'FlashCardManage',
        component: () => import('@/pages/adminPages/flashCard/flashCardManage.vue'),
      },
      {
        path:'categories'
        ,name:'categories',
        component: ()=> import('@/pages/adminPages/CourseManage/courseCategoryManager.vue')
      }
    ],
  },
]
