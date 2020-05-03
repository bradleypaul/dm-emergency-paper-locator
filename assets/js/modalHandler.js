const modal=document.querySelector("#modal")
const closeBtn=document.querySelector("#close-modal")




 var closeModal=function(){
     modal.setAttribute("class","closed")
 }

 closeBtn.addEventListener("click",closeModal)