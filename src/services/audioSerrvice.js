
import axios from 'axios';
import axiosInstance from './axiosService';
// .public_id để xóa
//.secure_url để lấy link hiển thị
 export const uploadAudio = async (file) => {
  //xin chữ ký từ server
  const sigRes = await axiosInstance.get("audio")
  console.log('sigRes',sigRes)
  const { timestamp, signature, api_key} = sigRes.data

  //upload lên Cloudinary
  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", api_key)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)
  formData.append("folder", "audios")
  formData.append('resource_type', 'video');

  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  )
  const data = uploadRes.data
  return data
}
