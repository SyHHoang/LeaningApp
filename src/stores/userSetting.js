import { defineStore } from 'pinia'

export const userStore = defineStore('userSetting', {

  state: () => ({
    userDeckSetting:[],
    examList:[],
    publicFlashCard:[],
    courseList:[],
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
     changeData(newArray,examId,questionPartCountList){
      this.examId = examId
      this.answerList = newArray
      this.questionPartCountList = questionPartCountList
    }
  }
})
