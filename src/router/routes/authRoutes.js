export default [
  {
    path:'/auth',
    name:'auth',
    children:[
      {
        path:'login',
        name:'login',
        component:()=>import('@/layouts/loginLayout.vue')
      },
      {
        path:'register',
        name:'register',
        component:()=>import('@/layouts/registerLayout.vue')
      }
    ]
  }
]
