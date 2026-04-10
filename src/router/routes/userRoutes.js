
export default[
{
  path: '/user',
  name: 'UserDashboard',
  component: () => import('@/layouts/userLayout.vue'),
  children: [
    {
      path:'examList',
      name:'ExamListPage',
      component: () => import('@/pages/userPages/exam/getExamList.vue'),
    },
    {
      path:'examDetail/:id',
      name:'ExamDetailPage',
      component: () => import('@/pages/userPages/exam/practicePages.vue'),
    },
    {
      path:'practice/:id',
      name:'PracticePage',
      component: () => import('@/pages/userPages/exam/practicePages.vue'),
    },
    {
      path: 'examResult/:id',
      name: 'ExamResultPage',
      component: () => import('@/pages/userPages/exam/examResultPages.vue'),
    },
    {
      path: 'examHistory',
      name: 'ExamHistoryPage',
      component: () => import('@/pages/userPages/exam/examHistory.vue'),
    },
    {
      path: 'courseList',
      name: 'CoursesPage',
      component: () => import('@/pages/userPages/course/coursesPage.vue'),
    },
    {
      path: 'courseDetail/:id',
      name: 'CourseDetailPage',
      component: () => import('@/pages/userPages/course/courseDetail.vue'),
    },
    {
      path: 'lessonDetail/:id',
      name: 'LessonDetailPage',
      component: () => import('@/pages/userPages/course/lessonDetailPage.vue'),
    },
    {
      path: 'flashcardsList',
      name: 'FlashcardPage',
      component: () => import('@/pages/userPages/flashCard/flashCardList.vue'),
    },
    {
        path:'flashcards/:id'
        ,name:'FlashCardManage',
        component: () => import('@/pages/adminPages/flashCard/flashCardManage.vue'),}
  ]
}
]
