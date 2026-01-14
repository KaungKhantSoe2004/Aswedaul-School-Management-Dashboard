import axios from "axios";

export const routeProtector = async()=> {
try{
       const admin_backend_domain_name = import.meta.env.VITE_ADMIN_BACKEND_DOMAIN_NAME;
   const response = await axios.get(`${admin_backend_domain_name}api/me`, {
    withCredentials:true
   });
   
   if(response.status == 200){
    
     return {
      status: true,
      data: response.data.user
     }
   }else{
     return false
   }
}catch(err){
    return false
}
}