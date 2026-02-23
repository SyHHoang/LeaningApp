<template>
  <div>
    <h1>Đề thi JLPT</h1>

    <div v-if="stepStatus===1">
      <h2>Lựa chọn mức độ</h2>
      <select v-model="examLevel">
        <option :value="'N5'">N5</option>
        <option :value="'N4'">N4</option>
        <option :value="'N3'">N3</option>
        <option :value="'N2'">N2</option>
        <option :value="'N1'">N1</option>
      </select>
      <button @click="stepStatus=2">Tiếp tục</button>
    </div>

    <div v-if="stepStatus===2">
      <h2>Thông tin đề thi</h2>
      <input v-model="examForm.title" placeholder="Tiêu đề đề thi" />
      <table>
        <thead>
          <tr>
            <th>Phần thi</th>
            <th>Số lượng câu hỏi</th>
            <th>Thời gian (phút)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Từ vựng</td>
            <td><input type="number" v-model="examForm.structure.vocabulary.count" /></td>
            <td><input type="number" v-model="examForm.structure.vocabulary.duration" /></td>
          </tr>
          <tr>
            <td>Đọc hiểu</td>
            <td><input type="number" v-model="examForm.structure.reading.count" /></td>
            <td><input type="number" v-model="examForm.structure.reading.duration" /></td>
          </tr>
          <tr>
            <td>Nghe hiểu</td>
            <td><input type="number" v-model="examForm.structure.listening.count" /></td>
            <td><input type="number" v-model="examForm.structure.listening.duration" /></td>
          </tr>

          <tr>
            <td>Tổng</td>
            <td>{{ examForm.structure.vocabulary.count + examForm.structure.reading.count + examForm.structure.listening.count }}</td>
            <td>{{ examForm.structure.vocabulary.duration + examForm.structure.reading.duration + examForm.structure.listening.duration }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="nextStep">Tiếp tục</button>
    </div>

    <div v-if="stepStatus===3">
                <h2>Đề thi {{ examForm.title }}</h2>
                <p>Mức độ: {{ examLevel }}</p>
                <p>Số lượng câu hỏi: {{ examForm.structure.vocabulary.count + examForm.structure.reading.count + examForm.structure.listening.count }}</p>
                <p>Thời gian làm bài: {{ examForm.structure.vocabulary.duration + examForm.structure.reading.duration + examForm.structure.listening.duration }} phút</p>
          <div class="add-exam-content">

              <div>
                  <div v-for="(n,index) in questionList" :key="index">
                    <i @click="updateQuestion(questionList[index])">Sửa</i>
                    <i @click="deleteQuestion(questionList[index])">Xóa</i>
                    <p>Câu hỏi {{ index + 1 }}</p>
                    <p>{{ n.questionText }}</p>
                    <img :src="n.urlLocal"/>
                    <p>{{ n.audio.audioUrl }}</p>
                    <p>Đáp án:</p>
                    <ul>
                      <li v-for="(option, index) in n.options" :key="index">{{ option }}</li>
                    </ul>
                    <p>Đáp án đúng: {{ n.correctAnswer }}</p>
                    <p>Giải thích: {{ n.explanation }}</p>
                  </div>
              </div>


            <div >
                <h2>Thêm câu hỏi</h2>
                    <h5>Câu hỏi {{ questionIndex }}</h5>
                    <input v-model="question.questionText" placeholder="Nội dung câu hỏi" />
                    <br/>
                    <h5>Hình ảnh (nếu có):</h5>
                    <input  type='file' @change="onFileChange"/>
                    <img :src="question.urlLocal"/>
                    <br/>
                    <h5>Âm thanh (nếu có):</h5>
                    <input v-model="question.audio.audioUrl" placeholder="URL âm thanh (nếu có)" />
                    <div>
                      <h5>Đáp án</h5>
                      <div v-for="(option, index) in 4" :key="index">
                        <label>Đáp án {{ index + 1 }}:</label>
                        <input v-model="question.options[index]" placeholder="Nội dung đáp án" />
                      </div>
                    </div>
                    <h5>Đáp án đúng:</h5><br/>
                    <select v-model="question.correctAnswer">
                      <option v-for="(option, index) in 4" :key="index" :value="index">Đáp án {{ index + 1 }}</option>
                    </select>
                    <br/>
                    <h5>Giải thích đáp án:</h5><br/>
                    <textarea v-model="question.explanation" placeholder="Giải thích đáp án"></textarea><br/>
                    <button @click="createQuestion">Lưu câu hỏi</button>
            </div>

        </div>
        <button @click="submitExam">Tạo đề thi</button>
  </div>
  </div>
</template>
<script setup>
import sendImageKit from "@/services/imageService";
import { ref } from "vue";
const examLevel= ref('N5')

const examForm=ref({
  title:"",
  level:examLevel.value,
  structure:{
    vocabulary:{
      count:0,
      duration:0
    },
    reading:{
      count:0,
      duration:0
    },
    listening:{
      count:0,
      duration:0
    },
  },
})
const questionList=ref([])
const file=ref(null)
const fileList=ref([])
const question=ref({
  questionText:"",
  urlLocal:"",
  image:{
    imageUrl:"",
    imageId:""
  },
  audio:{
    audioUrl:"",
    audioId:""
  },
  options:[],
  correctAnswer:"",
  explanation:"",
  score:1
})
const stepStatus=ref(1)
const questionIndex=ref(1)

const nextStep=()=>{
  if(examForm.value.structure.vocabulary.count>0 && examForm.value.structure.reading.count>0 && examForm.value.structure.listening.count>0){
    stepStatus.value=3
  }else{
    alert("Vui lòng nhập số lượng câu hỏi cho tất cả các phần thi")
  }
}
const onFileChange=(event)=>{
  const selectedFile=event.target.files[0]
  if(question.value.urlLocal){
    URL.revokeObjectURL(question.value.urlLocal)
  }
  if(selectedFile){
    question.value.urlLocal=URL.createObjectURL(selectedFile)
    file.value=selectedFile
  }
}
const createQuestion=()=>{
  questionList.value.push({...question.value})
  if(file.value) fileList.value.push({...file.value})
  file.value=null
  URL.revokeObjectURL(question.value.urlLocal)
  question.value={
    questionText:"",
    urlLocal:"",
    image:{
      imageUrl:"",
      imageId:""
    },
    audio:{
      audioUrl:"",
      audioId:""
    },
    options:[],
    correctAnswer:"",
    explanation:"",
    score:1
  }
  questionIndex.value++
}
const submitExam=async()=>{

//tạo mảng getImageUrl để lưu kết quả upload hình ảnh
const getImageUrl = await Promise.allSettled(
  questionList.value.map(async (n, index) => {
    if(!n.urlLocal) return {imageUrl:"", imageId:""}
    const uploadedImageUrl = await sendImageKit(n.urlLocal,fileList.value[index]);
    return {
      imageUrl: uploadedImageUrl.url,
      imageId: uploadedImageUrl.fileId
    }
  })
)
  for(let n=0;n<getImageUrl.length;n++){
    if(!questionList.value[n].urlLocal) continue
    questionList.value[n].image.imageUrl=getImageUrl[n].imageUrl
    questionList.value[n].image.imageId=getImageUrl[n].fileId
  }
//tạo data exam cuối cùng để gửi lên server
  const examData={
    title:examForm.value.title,
    level:examLevel.value,
    structure:examForm.value.structure,
    questions:questionList.value,
  }
  console.log(examData)
}
</script>
<style scoped>
.add-exam-content{
  display:flex;
  justify-content: space-between;
  gap:20px;
}
</style>
