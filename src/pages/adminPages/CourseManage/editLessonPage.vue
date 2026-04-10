<template>
  <!-- Lesson Info -->
   <label>Tiêu đề bài học</label>
   <input type="text" v-model="lessonInfo.title"/>
   <label>Miêu tả bài học</label>
   <input type="text" v-model="lessonInfo.description"/>
  <!-- Block List -->
  <div>
    <h2><b>Phần nội dung bài học</b></h2>
    <button @click="openBlockStatus=true">Thêm khối</button>
    <div v-for="(block,blockIndex) in blockArray" :key="blockIndex">
      <button @click="deleteContent(blockIndex,0,3)">Xóa khối</button>
      <h3>{{ block.blockTitle }}</h3><i class="bi bi-pencil-fill" @click="openChangeBlockTitle(block,blockIndex)"></i>
      <button @click="openAddForm(blockIndex)">Thêm nội dung</button>
      <div v-for="(item,contentIndex) in block.blockContent" :key="contentIndex">
        <button @click="openUpdateForm(blockIndex,item,contentIndex)">Sửa</button>
        <button @click="deleteContent(blockIndex,contentIndex,1)">Xóa</button>
        <video v-if="block.type==='video'" :src="item.videoUrl" controls></video>
        <img  class="img" v-if="item.imageUrl||item.imageUrlLocal" :src="item.imageUrlLocal||item.imageUrl"/>
        <p>{{ item.title }}</p>
        <audio v-if="item.audioUrl||item.audioUrlLocal" :src="item.audioUrlLocal||item.audioUrl" controls></audio>
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
  <!-- End Block List -->
  <!--Practice list  -->
  <div >
    <h2><b>Phần luyện tập</b></h2>
        <label>Tiêu đề phần luyện tập</label>
        <input type="text" v-model="practiceInfo.title" required/>
        <label>Mô tả phần luyện tập</label>
        <input type="text" v-model="practiceInfo.description" /><br/>
        <button @click="questionStatus=true">Thêm câu hỏi</button>
    <div v-for="(question,index) in questionArray" :key="index">
      <!-- <button @class="">Sửa</button> -->
      <button @click="deleteContent(index,0,2)">Xóa</button>
      <img  v-if="question?.image?.imageUrl||question?.image?.imageUrlLocal" class="img" :src="question.image.imageUrl||question.image.imageUrlLocal"/>
      <audio  v-if="question?.audio?.audioUrl||question?.audio?.audioUrlLocal" controls :src="question.audio.audioUrl||question.audio.audioUrlLocal"></audio>
      <p>{{ question.questionText }}</p>
      <div v-for="(answer,index) in question.options" :key="index">
          <p>{{index+1}}. {{ answer }}</p>
      </div>
      <label>Giải thích</label>
      <p>{{ question.explaination }}</p>
      <label>Đáp án đúng</label>
      <p>{{ question.correctAnswer }}</p>
    </div>
  </div>
<!-- //////////Phần modal -->
  <!-- blockTitle -->
      <div v-if="changeBlockTitleStatus">
        <button @click="closeChangeBlockTitle">Đóng</button>
          <input type="text" v-model="blockSelect.title">
          <button @click="changeBlockTitle">Xác nhận</button>
      </div>
  <!--  -->
   <div class="form">
    <!-- Block Form -->
    <div v-if="openBlockStatus">
      <i @click="openBlockStatus=false">Đóng</i>
      <select v-model="selected">
        <option v-for="(item,index) in type" :key="index" :value="typeValue[index]">
          {{ item }}
        </option>
      </select>
      <label>Tiêu đề</label>
      <input type="text" v-model="blockForm.blockTitle" required/>
      <button @click="chooseType">Xác nhận</button>
    </div>
    <!-- End Block Form -->
   </div>
  <!-- Form -->
  <div class="form" v-if="openBlockContentStatus">
    <button @click="closeBlockContent">Đóng</button>
    <div>
        <label>Tiêu đề</label>
        <input type='text' v-model="blockContentForm.title"/>
        <label>Nội dung</label>
        <textarea v-model="blockContentForm.content"></textarea>
        <label>Chọn ảnh</label>
        <input type="file" accept="image/*" @change="onImageChange"/>
        <img class="img" :src="blockContentForm.imageUrlLocal"/>
        <label>Chọn audio</label>
        <input type="file" accept="audio/*" @change="onAudioChange"/>
        <audio controls :src="blockContentForm.audioUrlLocal" ></audio>
        <button v-if="isAddBlock" @click="addToBlock">Xác nhận</button>
        <button v-if="!isAddBlock" @click="changeBlockContent">Xác nhận</button>
    </div>
  </div>
<!-- End Form -->
 <!-- QuestionForm -->

  <div class='form' v-if="questionStatus">
    <form @submit.prevent='addQuestion'>
        <label>Câu hỏi</label>
        <input type="text" v-model="questionForm.questionText"/><br>
        <label>Chọn ảnh</label>
        <input type="file" @change='questionImageChange' accept="image/*"/>
        <img class='img' v-if='questionForm.imageUrlLocal' :src="questionForm.imageUrlLocal"/><br>
        <label>Chọn audio</label>
        <input type="file" @change='questionAudioChange' accept="audio/*"/>
        <audio v-if="questionForm.audioUrlLocal" controls :src="questionForm.audioUrlLocal" ></audio><br>
        <label>Đáp án</label>
        <div v-for="n in 4" :key="n">
           <p>{{ n }} <input type="text" v-model="questionForm.options[n-1]"/></p>
        </div>
        <label>Đáp án đúng</label>
        <select v-model="questionForm.correctAnswer">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="3">3</option>
          <option :value="4">4</option>
        </select><br>
        <label>Giải thích đáp án</label>
        <input type="text" v-model="questionForm.explaination"/>
        <!-- <lablel>Điểm</lablel> -->
         <button type="submit">Xác nhận</button>
    </form>
  </div>
 <!-- End Question Form -->
<button @click="createLesson">Tạo bài học</button>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import sendImageKit from '@/services/imageService'
import { uploadAudio } from '@/services/audioSerrvice'
import axiosInstance from '@/services/axiosService'
import { alertService } from '@/services/alertService'
  import { useRoute } from 'vue-router'
const route = useRoute()
let courseID = null
let lessonID=null
const lessonInfo=ref({
  title:'',
  description:'',
})
const practiceInfo=ref({
  title:'',
  description:'',
})
const getEmptyQuestion=()=>{
  return {
    _id:'',
    questionText:'',
    image:{
      imageFile:null,
      imageUrlLocal:'',
      imageUrl:'',
      imageId: '',
    },
    audio:{
      audioFile:'',
      audioUrlLocal:'',
      audioUrl:'',
      audioId: '',
    },
    options:[],
    correctAnswer:0,
    explaination:'',
    score:0
  }
}
const getEmptyBlock=()=>{
  return {
    _id:'',
    type: '',
    // order: null,//map thêm trường sau khi gửi dữ liệu lên
    blockTitle:'',
    blockContent:[
    ],
  }
}
const getEmptyBlockContent=()=>{
           return {
            title:'',
            content:'',
            // Media fields
            imageFile:null,
            audioFile:null,
            imageUrlLocal:'',
            audioUrlLocal:'',
            videoUrl:'',
            imageUrl: '',
            imageId: '',
            audioUrl:'',
            audioId: '',
          }
}
const type = ['Tùy chỉnh', 'video']
const typeValue=['other','video']
const blockForm=ref(getEmptyBlock())
const blockContentForm=ref(getEmptyBlockContent())
const questionForm=ref(getEmptyQuestion())
const blockArray=ref([])
const questionArray=ref([])
//const blockArea=ref([])
const isAddBlock=ref(false)
const openBlockContentStatus=ref(false)
const openBlockStatus=ref(false)
const questionStatus=ref(false)
const changeBlockTitleStatus=ref(false)
const selected=ref('')
const contentUpdateSelect=ref('')
const blockSelect=ref()
////////update/////////////
//const newBlockArray=ref([])//suawr block,blockcontent và blockContent
const deleteBlockArray=ref([])//xoa block
//const updatePractice=ref([])//lưu tất cả question, thêm order(thứ tự),thêm change:true, thêm delete:true
const deletePractice=ref([])
//////////////////////////
const chooseType=()=>{//thêm block
  if(selected.value){
    blockForm.value.type=structuredClone(selected.value)
    blockForm.value.newBlock=true
    blockArray.value.push({...blockForm.value})
    blockForm.value=getEmptyBlock()
  }
}
const openAddForm=(index)=>{
  isAddBlock.value=true
  openBlockContentStatus.value=true
  blockSelect.value=index
}
const openUpdateForm=(blockIndex,contentData,contentIndex)=>{
    contentUpdateSelect.value={blockIndex:blockIndex,
                               contentData:contentData,
                               contentIndex:contentIndex
    }
    isAddBlock.value=false
    openBlockContentStatus.value=true
    blockContentForm.value=contentData
}
const addToBlock = () => {
  blockArray.value[blockSelect.value].blockContent.push({
    type:blockContentForm.value.type,
    title: blockContentForm.value.title,
    content: blockContentForm.value.content,
    imageFile: blockContentForm.value.imageFile,
    audioFile: blockContentForm.value.audioFile,
    imageUrlLocal: blockContentForm.value.imageUrlLocal,
    audioUrlLocal: blockContentForm.value.audioUrlLocal,
    videoUrl: blockContentForm.value.videoUrl,
    imageUrl: blockContentForm.value.imageUrl,
    imageId: blockContentForm.value.imageId,
    audioUrl: blockContentForm.value.audioUrl,
    audioId: blockContentForm.value.audioId,
  })
  //blockContentForm.value=getEmptyBlockContent()
  closeBlockContent()
}
const closeBlockContent=()=>{
  openBlockContentStatus.value=false
  blockSelect.value=null
  blockContentForm.value=getEmptyBlockContent()
  contentUpdateSelect.value=null
}
// const changeBlockContent=()=>{
// //contentUpdateForm và blockContent[i]và blockContentUpdate đang cùng tham chiếu
// blockArray.value[contentUpdateSelect.value.blockIndex].blockContent[contentUpdateSelect.value.contentIndex]=blockContentForm.value
// //blockContentForm.value=getEmptyBlockContent()
// closeBlockContent()
// }
const openChangeBlockTitle=(block,index)=>{
  changeBlockTitleStatus.value=true
  console.log("block title",block)
  console.log("block title",index)
  blockSelect.value={
      title:block.blockTitle,
      index:index
  }
}
const closeChangeBlockTitle=()=>{
  blockSelect.value=""
  changeBlockTitleStatus.value=false
}
const changeBlockTitle=()=>{
      blockArray.value[blockSelect.value.index].blockTitle=structuredClone(blockSelect.value.title)
      blockSelect.value=""
      changeBlockTitleStatus.value=false
}

const changeBlockContent = () => {
  const { blockIndex, contentIndex } = contentUpdateSelect.value

  blockArray.value[blockIndex].blockContent[contentIndex] = {
    _id:blockContentForm.value._id,
    title: blockContentForm.value.title,
    content: blockContentForm.value.content,

    // media mới (nếu có)
    imageFile: blockContentForm.value.imageFile,
    audioFile: blockContentForm.value.audioFile,

    // preview local
    imageUrlLocal: blockContentForm.value.imageUrlLocal,
    audioUrlLocal: blockContentForm.value.audioUrlLocal,

    // media cũ (nếu không thay file thì vẫn giữ)
    imageUrl: blockContentForm.value.imageUrl,
    imageId: blockContentForm.value.imageId,
    audioUrl: blockContentForm.value.audioUrl,
    audioId: blockContentForm.value.audioId,

    videoUrl: blockContentForm.value.videoUrl
  }

  closeBlockContent()
}
const onAudioChange=(event)=>{
  const file = event.target.files[0];
  if(blockContentForm.value.audioUrlLocal){
    URL.revokeObjectURL(blockContentForm.value.audioUrlLocal)
  }
  blockContentForm.value.audioUrlLocal=URL.createObjectURL(file)
  blockContentForm.value.audioFile=file
}
const onImageChange=(event)=>{
  const file = event.target.files[0];
  if(blockContentForm.value.imageUrlLocal){
    URL.revokeObjectURL(blockContentForm.value.imageUrlLocal)
  }
  blockContentForm.value.imageUrlLocal=URL.createObjectURL(file)
  blockContentForm.value.imageFile=file
}
const questionAudioChange=(event)=>{
  const file = event.target.files[0];
  if(questionForm.value.audio.audioUrlLocal){
    URL.revokeObjectURL(questionForm.value.audio.audioUrlLocal)
  }
  questionForm.value.audio.audioUrlLocal=URL.createObjectURL(file)
  questionForm.value.audio.audioFile=file
}
const questionImageChange=(event)=>{
  const file = event.target.files[0];
  if(questionForm.value.image.imageUrlLocal){
    URL.revokeObjectURL(questionForm.value.image.imageUrlLocal)
  }
  questionForm.value.image.imageUrlLocal=URL.createObjectURL(file)
  questionForm.value.image.imageFile=file
}
const addQuestion = () => {
  questionArray.value.push({
    _id: questionForm.value._id,
    questionText: questionForm.value.questionText,
    newQuestion:true,
    image: {
      imageFile: questionForm.value.image.imageFile,
      imageUrlLocal: questionForm.value.image.imageUrlLocal,
      imageUrl: questionForm.value.image.imageUrl,
      imageId: questionForm.value.image.imageId,
    },

    audio: {
      audioFile: questionForm.value.audio.audioFile,
      audioUrlLocal: questionForm.value.audio.audioUrlLocal,
      audioUrl: questionForm.value.audio.audioUrl,
      audioId: questionForm.value.audio.audioId,
    },

    options: [...questionForm.value.options],
    correctAnswer: questionForm.value.correctAnswer,
    explaination: questionForm.value.explaination,
    score: questionForm.value.score
  })

  console.log("mảng câu hỏi", questionArray.value)

  questionForm.value = getEmptyQuestion()
  questionStatus.value = false
}
const deleteContent=(arrayIndex,contentIndex,blockType)=>{
    switch(blockType){
      case 1:
        {//xóa content
          blockArray.value[arrayIndex].blockContent.splice(contentIndex,1)
          if(blockArray.value[arrayIndex]._id)blockArray.value[arrayIndex].change=true
          break
        }
      case 2://practice
      { if(questionArray.value[arrayIndex]._id){
          deletePractice.value.push({...questionArray.value[arrayIndex]})
      }
        questionArray.value.splice(arrayIndex,1)
        break
      }
      case 3://xóa khối
      { if(blockArray.value[arrayIndex]._id){
          deleteBlockArray.value.push({...blockArray.value[arrayIndex]})
        }
        blockArray.value.splice(arrayIndex,1)
        break
      }
    }
}

const getLesson=async()=>{
  const res=await axiosInstance.get(`lessons/${lessonID}`)
  if(res.data)
{   console.log("data",res.data)
    const data=res.data
    blockArray.value=data.blockData
    lessonInfo.value.title=data.lessonData.title
    lessonInfo.value.description=data.lessonData.description
    questionArray.value=data.lessonData.practice.content
    practiceInfo.value.title=data.lessonData.practice.title,
    practiceInfo.value.description=data.lessonData.practice.description
}
}
//main
const getURL = async (blockContentData) => {//trả về giá trị gửi lên BE(blockContent của block)
  const endData=await Promise.allSettled(
    blockContentData.map(async (contentData) => {
      let imageData = {};
      let audioData = {};
      let oldImageId=''
      let oldAudioId=''
      console.log("dữ liệu từng block",contentData)
      console.log("image url local",contentData.imageUrlLocal )
      if (contentData.imageUrlLocal) {
        oldImageId=contentData.imageId
        imageData = await sendImageKit(
          contentData.imageUrlLocal,
          contentData.imageFile
        );
        console.log('image kit data là',imageData)
      }
      if (contentData.audioUrlLocal) {
        oldAudioId=contentData.audioId
        audioData = await uploadAudio(contentData.audioFile);
      }
      return {
        type:contentData.type,
        title: contentData.title,
        content: contentData.content,
        oldImageId:oldImageId,
        imageUrl: imageData.url||contentData.imageUrl,
        imageId: imageData.fileId||contentData.imageId,
        oldAudioId:oldAudioId,
        audioUrl: audioData.secure_url||contentData.audioUrl,
        audioId: audioData.public_id||contentData.audioId,
      };
    })
  )
  return endData.map((n)=>{
    return n.value
  });
};
const getQuestionUrl=async()=>{
  const res=await Promise.allSettled(
  questionArray.value.map(async(n,index)=>{
    let audioUrl=''
    let imageUrl=''
    let audioId=''
    let imageId=''
    let oldAudioId=''
    let oldImageId=''
    let newQuestion = false
    if(n.image.imageUrlLocal)
      {
        oldImageId=n?.image.imageId||''
        const data=await sendImageKit(n.image.imageUrlLocal,n.image.imageFile)
        imageUrl=data.url
        imageId=data.fileId
      }
    if(n.audio.audioUrlLocal){
        oldAudioId=n?.audio.audioId||''
        const data=await uploadAudio(n.audio.audioFile)
        audioUrl=data.secure_url
        audioId=data.public_id
    }
    if(!n._id){
      newQuestion=true
    }
    return{
      questionText:n.questionText,
      newQuestion:newQuestion,
      order:index,
      image:{
        imageUrl:imageUrl,
        imageId:imageId,
        oldImageId:oldImageId
      },
      audio:{
        audioUrl:audioUrl,
        audioId:audioId,
        oldAudioId:oldAudioId
      },
      options:n.options,
      correctAnswer:n.correctAnswer,
      explaination:n.explaination
    }
  })
)
  return res.map((n)=>{return n.value})
}
const createLesson=async()=>{
  const newBlockArray1= await Promise.allSettled(
  blockArray.value.map(async(n,index)=>{
    return {
      _id:n._id,
      blockTitle:n.blockTitle,
      change:n?.change,
      newBlock:n?.newBlock||false,
      order:index,
      blockContent:await getURL(n.blockContent)
    }
  }),
)
  const newBlockArray2=newBlockArray1.map((n)=>{
    return n.value
  })
  const data={
    lessonTitle:lessonInfo.value.title,
    lessonDescripsion:lessonInfo.value.description,
    blockArray:newBlockArray2,
    practice: await getQuestionUrl(),
    practiceInfo:{
      title:practiceInfo.value.title,
      description:practiceInfo.value.description
    },
    deleteBlockArray:deleteBlockArray.value,
    deletePractice:deletePractice.value
  }
  console.log("dataaaaa",data)
  const response=await axiosInstance.put(`lessons/${courseID}/${lessonID}`,data)
  if(response.data.success){
    alertService('success',"Tạo bài học thành công")
  }
}
onMounted(async() => {
  courseID = route.params.id
  lessonID=route.params.lessonId
  console.log(courseID)
  await getLesson()
})
//
</script>
<style scoped>
.img{
  max-width:300px;
  max-height: 300px;
}

</style>


