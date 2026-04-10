import Swal from 'sweetalert2'

export const alertService=(icon,title)=>{
  return Swal.fire({
  toast: true,
  position: 'top-end',
  icon: icon,//'success', 'error', 'warning', 'info','question'
  title: title,
  showConfirmButton: false,
  timer: 2000
})
}
