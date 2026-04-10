<template>
  <div class="add-exam-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Thêm đề thi</h1>
      <router-link to="/admin/exams" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i>
        Quay lại danh sách
      </router-link>
    </div>
    <p>Thông tin đề thi</p>
    <label>Tên đề thi</label>
    <input type="text" v-model="examInfo.title">
    <label>Trình độ</label>
    <select v-model="examInfo.level">
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
        <option value="B2">B2</option>
        <option value="C1">C1</option>
        <option value="C2">C2</option>
        <option value="None">None</option>
    </select>
    <label>Kiểu đề thi</label>
    <select v-model="examInfo.examCategory">
        <option value="toeic">TOEIC</option>
        <option value="ielts">IELTS</option>
        <option value="toefl">TOEFL</option>
        <option value="other">Khác</option>
    </select>
    <label>Dạng làm bài</label>
    <select v-model="examInfo.examType">
        <option value="free">làm bài tự do</option>
        <option value="order">Làm bài theo thứ tự</option>
    </select>
    <div v-if="examInfo.examType==='free'">
      <label>Tổng thời gian (phút)</label>
      <input type="number" v-model="examInfo.totalTime" />
    </div>
    <div>
      <button @click="openForm(1,'',null)">Thêm phần thi</button>
    </div>
    <!-- List -->
    <div>
        <div v-if="partList.length === 0">Chưa có phần nào</div>
        <div v-else>
          <div v-for="(part, index) in partList" :key="index">

            <p>Phần {{ index + 1 }} </p>
         <div>
        <button @click="openForm(4,part,index,null,null)">Sửa</button>
        <button @click="deleteForm(1,index,null,null)">Xóa</button>
        <button v-if="part.type==='many'" @click="openForm(2,null,index,null,null)">Thêm khối câu hỏi</button>
        <button v-if="part.type==='one'" @click="openForm(3,null,index,null,null)">Thêm câu hỏi</button>
        </div>
            <p><b>Tiêu đề:</b> {{ part.title }}</p>
            <p><b>Loại:</b> {{ part.type==='one'?'Câu hỏi đơn':'Khối câu hỏi' }}</p>
            <p><b>Nội dung:</b> {{ part.content }}</p>
            <p><b>Thời gian:</b> {{ part.time }} (phút)</p>
            <div v-if="part.imageUrlLocal">
              <img :src="part.imageUrlLocal" style="max-width:200px"/>
            </div>
            <div v-if="part.audioUrlLocal">
              <audio :src="part.audioUrlLocal" controls></audio>
            </div>
            <hr/>
            <!-- Danh sách khối câu hỏi -->
                  <div v-if="part.type==='many'">
                      <div class="block-list" v-for="(block,blockIndex) in part.questionList" :key="blockIndex">
                          <div class="block"><p>{{ block.content }}</p><button @click="openForm(5,block,index,blockIndex,null)">Sửa</button>
                            <button @click="deleteForm(2,index,null,null)">Xóa</button>
                          <img v-if="block.imageUrlLocal" :src="block.imageUrlLocal" style="max-width:200px"/>
                          <audio v-if="block.audioUrlLocal" :src="block.audioUrlLocal" controls></audio>
                          <button @click="openForm(7,null,index,blockIndex,null)">Thêm câu hỏi con</button></div>
                          <div class="block-question" v-for="(question,questionIndex) in block.question" :key='questionIndex'>
                              <p>{{ question.questionText }}</p><button @click="openForm(8,question,index,blockIndex,questionIndex)">Sửa</button>
                              <button @click="deleteForm(3,index,index,blockIndex,questionIndex)">Xóa</button>
                              <p v-for="(option,optionIndex) in question.options" :key="optionIndex">{{optionIndex+1}}. {{ option }}</p>
                              <p>Đáp án đúng: {{question.correctAnswer}}</p>
                              <p>Giải thích đáp án: {{ question.explaination }}</p>
                              <p>Điểm: {{ question.score }}</p>
                          </div>

                      </div>
                  </div>
             <!-- Danh sách câu hỏi -->
                  <div v-if="part.type==='one'">
                      <div v-for="(question,questionIndex) in part.questionList" :key="questionIndex">
                        <p>{{ question.questionText }}</p><button @click="openForm(6,question,index,null,questionIndex)">Sửa</button>
                        <button @click="deleteForm(4,index,null,questionIndex)">Xóa</button>
                        <img v-if="question.image.imageUrlLocal" :src="question.image.imageUrlLocal" style="max-width: 200px;"/>
                        <audio v-if="question.audio.audioUrlLocal" :src="question.audio.audioUrlLocal" controls></audio>
                        <div>
                            <p v-for="(n,optionIndex) in question.options" :key="n">{{optionIndex+1}}. {{ n }}</p>
                        </div>
                        <p>Đáp án đúng: {{ question.correctAnswer }}</p>
                        <p>Giải thích: {{ question.explaination }}</p>
                        <p>Điểm: {{ question.score }}</p>
                      </div>
                  </div>
          </div>
        </div>
    </div>
    <div>

    </div>
    <!-- ///////////////Phần modal -->
    <div v-if="partModalStatus" class="form">
      <button @click="closeForm(1)">Đóng</button>
      <label>Tên phần thi</label>
      <input type="text" v-model="partForm.title"/>
      <label>Loại câu hỏi</label>
      <select v-model="partForm.type">
        <option value="one">Câu hỏi đơn</option>
        <option value="many">Khối câu hỏi</option>
      </select>
      <label>Thời gian (phút)</label>
      <input type="number" min="0" v-model="partForm.time"/>
      <label>Hình ảnh</label>
      <input type="file" @change="handlePartImageChange"/>
      <img v-if='partForm.imageUrlLocal' :src="partForm.imageUrlLocal" style="max-width:200px"/>
      <label>Audio</label><button>Xóa Audio</button>
      <input type="file" @change="handlePartAudioChange"/>
      <audio v-if='partForm.audioUrlLocal' :src="partForm.audioUrlLocal" controls></audio>
      <label>Nội dung</label>
      <input type="text" v-model="partForm.content"/>
      <button v-if="isAdd" @click="addPart">Xác nhận thêm</button>
      <button v-if="!isAdd" @click="updatePart">Xác nhận sửa</button>
    </div>
    <!-- modal khối câu hỏi -->
     <div v-if="blockModalStatus" class="form">
      <button @click="closeForm(2)">Đóng</button>
      <div>
        <label>Nội dung khối</label>
        <input type="text" v-model="blockForm.content"/>
        <label>Ảnh</label>
        <input type="file" accept="image/*" @change="blockImageChange"/>
        <img v-if="blockForm.imageUrlLocal" :src="blockForm.imageUrlLocal" style="max-width:200px"/>
        <label>Audio</label>
        <input type="file" accept="audio/*" @change="blockAudioChange" controls/>
        <audio v-if='blockForm.audioUrlLocal' controls :src="blockForm.audioUrlLocal"></audio>
        <button v-if='isAdd' @click="addBlock">Xác nhận thêm</button>
        <button v-if='!isAdd' @click="updateBlock">Xác nhận sửa</button>
        <!-- <label>Câu hỏi con</label><button @click="blockQuestionCount++">Thêm câu hỏi con</button>
          <div v-for="n in blockQuestionCount" :key="n">
            <label>Câu hỏi</label>
            <input type="text" v-model="blockForm.question[n-1].questionText"/>
            <label>Câu trả lời</label>
              <div v-for="m in 4" :key="m">
              <p>{{ m }} <input type="text" v-model="blockForm.question[n-1].options[m-1]"/></p>
              </div>
            <label>Đáp án</label>
            <select v-model="blockForm.question[n-1].correctAnswer">
              <option v-for="k in 4" :key="k">{{ k }}</option>
            </select>
            <label>Giải thích</label>
            <input type="text" v-model="blockForm.question[n-1].explaination"/>
            <label>Điểm</label>
            <input type="text" v-model="blockForm.question[n-1].score"/>
          </div> -->
      </div>
     </div>
     <!-- modal câu hỏi con của block -->
      <div v-if="questionBlockModalStatus" class="form">
        <button @click="closeForm()">Đóng</button>
         <div>
          <label>Câu hỏi</label>
          <input type="text" v-model="questionBlockForm.questionText"/>
          <label>Câu trả lời</label>
          <div v-for="n in 4" :key="n">
            <p>{{ n }}. <input type="text" v-model="questionBlockForm.options[n-1]"/></p>
          </div>
          <label>Đáp án đúng</label>
          <select v-model="questionBlockForm.correctAnswer">
            <option v-for="n in 4" :key="n" >{{ n }}</option>
          </select>
          <label>Giải thích</label>
          <input type="text" v-model="questionBlockForm.explaination"/>
          <label>Điểm</label>
          <input type="number" v-model="questionBlockForm.score"/>
          <button v-if="isAdd" @click="addQuestionToBlock">Xác nhận thêm</button>
          <button v-if="!isAdd" @click="updateQuestionToBlock">Xác nhận sửa</button>
        </div>
      </div>
     <!-- modal câu hỏi đơn -->
      <div v-if="questionModalStatus" class="form">
        <button @click="closeForm(3)">Đóng</button>
        <div>
          <label>Câu hỏi</label>
          <input type="text" v-model="questionForm.questionText"/>
          <label>Ảnh</label>
          <input type="file" accept="image/*" @change="questionImageChange"/>
          <img v-if="questionForm.image.imageUrlLocal" :src="questionForm.image.imageUrlLocal" style="max-width:200px;"/>
          <label>Audio</label>
          <input type="file" accept="audio/*" @change="questionAudioChange"/>
          <audio v-if="questionForm.audio.audioUrlLocal" :src="questionForm.audio.audioUrlLocal" controls></audio>
          <label>Câu trả lời</label>
          <div v-for="n in 4" :key="n">
            <p>{{ n }}. <input type="text" v-model="questionForm.options[n-1]"/></p>
          </div>
          <label>Đáp án đúng</label>
          <select v-model="questionForm.correctAnswer">
            <option v-for="n in 4" :key="n" >{{ n }}</option>
          </select>
          <label>Giải thích</label>
          <input type="text" v-model="questionForm.explaination"/>
          <label>Điểm</label>
          <input type="number" v-model="questionForm.score"/>
          <button v-if='isAdd' @click="addQuestion">Xác nhận</button>
          <button v-if='!isAdd' @click="updateQuestion">Xác nhận sửa</button>
        </div>
      </div>
      <!-- Modal xác nhận xóa -->
       <div v-if="deleteModalStatus">
        <p>Bạn có chắc muốn xóa phần này?</p>
        <i @click="closeForm(5)"></i>
        <button @click="doDelete">Xác nhận</button>
        <button @clik="closeForm(5)">Hủy bỏ</button>
       </div>
    <div><button @click="addExam">Thêm đề thi</button></div>
  </div>
</template>

<script setup>
import sendImageKit from '@/services/imageService';
import axiosInstance from '@/services/axiosService';
import { ref } from 'vue';
import { uploadAudio } from '@/services/audioSerrvice';
import { alertService } from '@/services/alertService';

/////////////////////////
const getEmptyPart=()=>{
  return{
    title:'',
    type:'one',
    content:'',
    imageFile:null,
    imageUrlLocal:'',
    imageUrl:'',
    imageId:'',
    audioFile:null,
    audioUrlLocal:'',
    audioUrl:'',
    audioId:'',
    questionList:[],
    time:0
  }
}
const getEmptyBlock=()=>{
  return {
    content:'',
    imageFile:null,
    imageUrlLocal:'',
    imageUrl:'',
    imageId:'',
    audioFile:null,
    audioUrlLocal:'',
    audioUrl:'',
    audioId:'',
    question:[
      // {
      //   questionText:'',
      //   options:[],
      //   correctAnswer:0,
      //   explaination:'',
      //   score:0
      // }
    ]
  }
}
const getEmptyBlockQuestion=()=>{
  return{
    questionText:'',
    options:[],
    correctAnswer:0,
    explaination:'',
    score:0
  }
}
const getEmptyQuestion=()=>{
  return {
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
const partForm=ref(getEmptyPart())
const blockForm=ref(getEmptyBlock())
const questionForm=ref(getEmptyQuestion())
const questionBlockForm=ref(getEmptyBlockQuestion())
const partList=ref([])
const examInfo=ref({
  title:'',
  examCategory:'other',
  examType:'free',
  level:'None',
  totalTime:0
})
/////////////////////////
const partModalStatus=ref(false)
const blockModalStatus=ref(false)
const questionModalStatus=ref(false)
const questionBlockModalStatus=ref(false)
const deleteModalStatus=ref(false)
const isAdd=ref(true)
const deleteType=ref(null)//xác định xóa cái nào
//index//
const selectedPart=ref(null)//dùng để xác định phần thi thêm câu hỏi
const selectedBlock=ref(null)
const selectedQuestion=ref(null)//dùng chung cho cau hỏi con và câu hỏi đơn
////////
const openForm=(type,data,partIndex,blockIndex,questionIndex)=>{
  console.log("part index",partIndex)
  console.log("block index",blockIndex)
  console.log("question index",questionIndex)
  switch(type){
    //add
    case 1://part form
          {
            partModalStatus.value=true
            isAdd.value=true
            break
          }
    case 2://Block question form
          {
            blockModalStatus.value=true
            selectedPart.value=partIndex
            isAdd.value=true
            break
          }
    case 3://Single question form
          {
            questionModalStatus.value=true
            selectedPart.value=partIndex
            isAdd.value=true
            break
          }
          //update
        case 4:
          {
            partModalStatus.value=true
            isAdd.value=false
            partForm.value={...data}
            selectedPart.value=partIndex
            break
          }
        case 5:{
            blockModalStatus.value=true
            isAdd.value=false
            blockForm.value={...data}
            selectedPart.value=partIndex
            selectedBlock.value=blockIndex
            break
        }
        case 6:{
            questionModalStatus.value=true
            isAdd.value=false
            questionForm.value={...data}
            selectedPart.value=partIndex
            selectedQuestion.value=questionIndex
            break
        }
        //câu hỏi con
        case 7: {
            questionBlockModalStatus.value=true
            isAdd.value=true
            selectedPart.value=partIndex
            selectedBlock.value=blockIndex
            break
        }
        case 8: {
            questionBlockModalStatus.value=true
            isAdd.value=false
            questionBlockForm.value={...data}
            selectedPart.value=partIndex
            selectedBlock.value=blockIndex
            selectedQuestion.value=questionIndex
            break
        }
      }
}
const closeForm=(type)=>{
  switch(type){
    case 1://part form
          {
            partModalStatus.value=false
            break
          }
    case 2://Block question form
          {
            blockModalStatus.value=false
            break
          }
    case 3://Single question form
          {
            questionModalStatus.value=false
            break
          }
    case 4: //question block form
          {
            questionBlockModalStatus.value=false
            break
          }
    case 5://delete form
          {
          deleteType.value=null
          selectedPart.value=null
          selectedBlock.value=null
          selectedQuestion.value=null
          deleteModalStatus.value=false
          }
  }
}
const deleteForm=(type,partIndex,blockIndex,questionIndex)=>{
          deleteModalStatus.value=true
          deleteType.value=type
          selectedPart.value=partIndex
          selectedBlock.value=blockIndex
          selectedQuestion.value=questionIndex
}
const doDelete=()=>{
      switch(deleteType.value)
      {
        case 1:{
            partList.value.splice(selectedPart.value,1)
            deleteType.value=null
            deleteModalStatus.value=false
            break
        }
        case 2:{
            partList.value[selectedPart.value].questionList.splice(selectedBlock.value,1)
            deleteType.value=null
            deleteModalStatus.value=false

            break
          }
        case 3:{
            partList.value[selectedPart.value].questionList[selectedBlock.value].question.splice(selectedQuestion.value,1)
            deleteType.value=null
            deleteModalStatus.value=false
            break
        }
        case 4:{
            partList.value[selectedPart.value].questionList.splice(selectedQuestion.value,1)
            deleteType.value=null
            deleteModalStatus.value=false
            break
        }
      }
}
/////////////////////////
const addPart=()=>{
    partList.value.push({...partForm.value})
    partForm.value=getEmptyPart()
    partModalStatus.value=false
}
const addBlock=()=>{
    partList.value[selectedPart.value].questionList.push({...blockForm.value})
    blockForm.value=getEmptyBlock()
    blockModalStatus.value=false
}
const addQuestionToBlock=()=>{
    partList.value[selectedPart.value].questionList[selectedBlock.value].question.push({...questionBlockForm.value})
    questionBlockForm.value=getEmptyBlockQuestion()
    questionBlockModalStatus.value=false
}
const addQuestion=()=>{
    partList.value[selectedPart.value].questionList.push({...questionForm.value})
    questionForm.value=getEmptyQuestion()
    questionModalStatus.value=false
}
const updatePart=()=>{
    if(partList.value[selectedPart.value].type!==partForm.value.type && partList.value[selectedPart.value].questionList.length>0 )
    { alertService('error','Để chuyển kiểu phần thi, bạn cần xóa hết các câu hỏi trước')
      return
    }
    partList.value[selectedPart.value]={...partForm.value}
    partForm.value=getEmptyPart()
    selectedPart.value=null
    partModalStatus.value=false
}
const updateBlock=()=>{
  partList.value[selectedPart.value].questionList[selectedBlock.value]={...blockForm.value}
  blockForm.value=getEmptyBlock()
  selectedPart.value=null
  selectedBlock.value=null
  blockModalStatus.value=false
}
const updateQuestionToBlock=()=>{
  partList.value[selectedPart.value].questionList[selectedBlock.value].question[selectedQuestion.value]={...questionBlockForm.value}
  questionBlockForm.value=getEmptyBlockQuestion()
  selectedPart.value=null
  selectedBlock.value=null
  selectedQuestion.value=null
  questionBlockModalStatus.value=false
}
const updateQuestion=()=>{
  partList.value[selectedPart.value].questionList[selectedQuestion.value]={...questionForm.value}
  questionForm.value=getEmptyQuestion()
  selectedPart.value=null
  selectedQuestion.value=null
  questionModalStatus.value=false
}
//=====================================================
//lựa chọn image, audio file
const handlePartImageChange = (event) => {
  const file = event.target.files?.[0]
  if (partForm.value.imageUrlLocal) {
    URL.revokeObjectURL(partForm.value.imageUrlLocal)
  }
  if (file) {
    partForm.value.imageUrlLocal = URL.createObjectURL(file)
    partForm.value.imageFile = file
    console.log('Image selected:', file.name)
  } else {
    partForm.value.imageUrlLocal = ''
    partForm.value.imageFile = null
  }
}
const handlePartAudioChange = (event) => {
  const file = event.target.files?.[0]
  if (partForm.value.audioUrlLocal) {
    URL.revokeObjectURL(partForm.value.audioUrlLocal)
  }
  if (file) {
    partForm.value.audioUrlLocal = URL.createObjectURL(file)
    partForm.value.audioFile = file
    console.log('Audio selected:', file.name)
  } else {
    partForm.value.audioUrlLocal = ''
    partForm.value.audioFile = null
  }
}
const blockImageChange = (event) => {
  const file = event.target.files?.[0]
  if (blockForm.value.imageUrlLocal) {
    URL.revokeObjectURL(blockForm.value.imageUrlLocal)
  }
  if (file) {
    blockForm.value.imageUrlLocal = URL.createObjectURL(file)
    blockForm.value.imageFile = file
    console.log('Image selected:', file.name)
  } else {
    blockForm.value.imageUrlLocal = ''
    blockForm.value.imageFile = null
  }
}
const blockAudioChange = (event) => {
  const file = event.target.files?.[0]
  if (blockForm.value.audioUrlLocal) {
    URL.revokeObjectURL(blockForm.value.audioUrlLocal)
  }
  if (file) {
    blockForm.value.audioUrlLocal = URL.createObjectURL(file)
    blockForm.value.audioFile = file
    console.log('Audio selected:', file.name)
  } else {
    blockForm.value.audioUrlLocal = ''
    blockForm.value.audioFile = null
  }
}
const questionImageChange = (event) => {
  const file = event.target.files?.[0]
  if (questionForm.value.image.imageUrlLocal) {
    URL.revokeObjectURL(questionForm.value.image.imageUrlLocal)
  }
  if (file) {
    questionForm.value.image.imageUrlLocal = URL.createObjectURL(file)
    questionForm.value.image.imageFile = file
  } else {
    questionForm.value.image.imageUrlLocal = ''
    questionForm.value.image.imageFile = null
  }
}
const questionAudioChange = (event) => {
  const file = event.target.files?.[0]
  if (questionForm.value.audio.audioUrlLocal) {
    URL.revokeObjectURL(questionForm.value.audio.audioUrlLocal)
  }
  if (file) {
    questionForm.value.audio.audioUrlLocal = URL.createObjectURL(file)
    questionForm.value.audio.audioFile = file
  } else {
    questionForm.value.audio.audioUrlLocal = ''
    questionForm.value.audio.audioFile = null
  }
}
//==============================================
//main
const getBlockUrl=async(blockList)=>{
  const res=await Promise.allSettled(
    blockList.map(async(block,index)=>{
        let imageUrl=''
        let imageId=''
        let audioUrl=''
        let audioId=''
        if(block.imageUrlLocal)
        {
          const data= await sendImageKit(block.imageUrlLocal,block.imageFile)
          imageUrl=data.url
          imageId=data.fileId
        }
        if(block.audioUrlLocal){
          const data= await uploadAudio(block.audioFile)
          audioUrl=data.secure_url
          audioId=data.public_id
        }
        return {
          order:index,
          content:block.content,
          imageUrl:imageUrl,
          imageId:imageId,
          audioUrl:audioUrl,
          audioId:audioId,
          question:block.question
        }

    })
  )
  return res.map((n)=>{
    return n.value
  })
}
const getQuestionUrl=async(questionList)=>{
  const res=await Promise.allSettled(
    questionList.map(async(question,index)=>{
        let imageUrl=''
        let imageId=''
        let audioUrl=''
        let audioId=''
        if(question.image.imageUrlLocal)
        {
          const data= await sendImageKit(question.image.imageUrlLocal,question.image.imageFile)
          imageUrl=data.url
          imageId=data.fileId
        }
        if(question.audio.audioUrlLocal){
          const data= await uploadAudio(question.audio.audioFile)
          audioUrl=data.secure_url
          audioId=data.public_id
        }
  return {
        questionText:question.questionText,
        order:index,
        image:{
          imageUrl:imageUrl,
          imageId: imageId,
        },
        audio:{
          audioUrl:audioUrl,
          audioId: audioId,
        },
        options:question.options,
        correctAnswer:question.correctAnswer,
        explaination:question.explaination,
        score:question.score
  }

    })
  )
  return res.map((n)=>{
    return n.value
  })
}
const getPartUrl=async()=>{
    const res= await Promise.allSettled(
      partList.value.map(async(part,index)=>{
        let imageUrl=''
        let imageId=''
        let audioUrl=''
        let audioId=''
        let questionList=[]
        if(part.imageUrlLocal)
        {
          const data= await sendImageKit(part.imageUrlLocal,part.imageFile)
          imageUrl=data.url
          imageId=data.fileId
        }
        if(part.audioUrlLocal){
          const data= await uploadAudio(part.audioFile)
          audioUrl=data.secure_url
          audioId=data.public_id
        }
        if(part.type==='many')
        {
          questionList=await getBlockUrl(part.questionList)||[]
        }
        if(part.type==='one')
        {
          questionList=await getQuestionUrl(part.questionList)||[]
        }
        return{
          title:part.title,
          type:part.type,
          order:index,
          content:part.content,
          imageUrl:imageUrl,
          imageId:imageId,
          audioUrl:audioUrl,
          audioId:audioId,
          questionList:questionList,
          time:part.time
        }
      })
    )
    return res.map((n)=>{
    return n.value
  })
}
const addExam=async()=>{
  //thử cách gửi toàn bộ ảnh,audio của part,block,question cùng 1 lượt
  //chậm
    const mainContent=await getPartUrl()
    const payload = JSON.parse(JSON.stringify(mainContent));
    const data=
    {
      title: examInfo.value.title,
      level: examInfo.value.level,
      examCategory: examInfo.value.examCategory,
      examType: examInfo.value.examType,
      totalTime: examInfo.value.totalTime,
      mainContent:payload

    }
    console.log("data gửi lên BE",data)
    const res=await axiosInstance.post('/exams',data)
    if(res.data.success){
      alertService('success','Thêm đề thi thành công')
    }
    else alertService('error','Thêm đề thi thất bại')
}
</script>

<style scoped>
.form{
  display: flex;
  flex-direction: column;
  max-width: 500px;
}
.block{
  display:flex;
  flex-direction:column;
}
.block-list{
  display:flex;
  flex-direction:row;

}
.block-question{
  display:flex;
  flex-direction:column;
}
</style>
