import { defineStore } from 'pinia'

export const userStore = defineStore('userSetting', {

  state: () => ({
    userId:''
  }),
  actions: {
     changeData(userId){
        this.userId=userId
    }
  }
})
