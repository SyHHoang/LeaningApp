
export default[
{
  path: '/user',
  name: 'UserDashboard',
  component: () => import('@/layouts/userLayout.vue'),
  children: [
    {
      path: 'flashcardsList',
      name: 'FlashcardPage',
      component: () => import('@/pages/userPages/practicePages.vue'),
    },
    {
      path:'flashcards/:id',
      name:'FlashcardDetailPage',
      component: () => import('@/pages/userPages/addFlashcardPage.vue'),
    }
  ]
}
]
