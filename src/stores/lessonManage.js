import { defineStore } from 'pinia'

export const lessonStore = defineStore('LessonManage', {

  state: () => ({
    currentLessonIndex:0,
    lessonList:[]
  }),
  actions: {
    getIndex(index){
        this.currentLessonIndex = index
    },
    fetchData(lessonIdList){
      this.lessonList=lessonIdList
      this.currentLessonIndex = 0
    }
  },
  getters:{
    getcurrentIndex(){
      let status=''
      if(this.currentLessonIndex === this.lessonList.length-1) status='isLast'
      if(this.currentLessonIndex === 0) status='isFirst'
      return {
        index:this.currentLessonIndex,
        status:status
      }
    },
    getNextLesson(){
      this.currentLessonIndex+=1
      if(this.currentLessonIndex >= this.lessonList.length) this.currentLessonIndex = this.lessonList.length-1
      return this.lessonList[this.currentLessonIndex]
    },
    getOldLesson(){
      this.currentLessonIndex-=1
      if(this.currentLessonIndex <0 ) this.currentLessonIndex = 0
      return this.lessonList[this.currentLessonIndex]
    }
  }
})
