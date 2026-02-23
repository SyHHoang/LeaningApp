import axiosInstance from "./axiosService";
import axios from 'axios'
//tham số filename: String nên là giá trị từ URL.createObjectURL(file.value) để sau này tiện update, so sánh ảnh rồi xóa
//tham số file: giá trị (ví dụ a.value, v...v) ảnh lấy từ máy(không phải url)
//.url //đường dẫn imagekit đã lưu ảnh
//.fileId //id ảnh dùng để xóa ảnh trên imagekit khi cần thiết
const sendImageKit=async(fileName,file)=>{
  //tạo tên ảnh
  const now = new Date();
  const time = now
    .toLocaleTimeString("en-GB", { hour12: false })
    .replaceAll(":", "");

  const date = now
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  const name= `--${fileName}--.${time}.${date}`;
  console.log(name)
  //gửi lên imagekit
  const { data: auth } = await axiosInstance.get("/imgUpload/imageKitToken");
        URL.revokeObjectURL(fileName)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", name);
        formData.append("token", auth.token);
        formData.append("expire", auth.expire);
        formData.append("signature", auth.signature);
        formData.append("folder", "/uploads");
        formData.append('publicKey',import.meta.env.VITE_IMGKIT_PUBLIC_KEY)
        const res = await axios.post(
        import.meta.env.VITE_IMGKIT_URL,
        formData
        );
        console.log("data từ imagekit",res.data)
        return {url:res.data.url||import.meta.env.VITE_IMG_ERROR_URL,
                fileId:res.data.fileId||""}
}

export default sendImageKit
