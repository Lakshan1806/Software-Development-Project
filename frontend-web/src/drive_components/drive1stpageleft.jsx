import { Link } from "react-router-dom"; 
       
 function Drive1stpageleft(){

    return(

    <div className="flex-col w-[522px] px-[0px] py-[200px] justify-center items-center gap-[10px] self-stretch font-sans grid justify-items-center ">
        
            <p className= "w-[522px] text-black  text-[44px] not-italic font-[400] leading-12 stroke-[1px] stroke-black mx-28 font-sans ">
                Drive on your schedule 
                and earn what you 
                deserve.</p>
        
           <p> <Link className="text-black p-4 px-0.5 gap-[10px] text-[20px] font-[700] items-center leading-24 font-sans">Already have an account? Sign in</Link></p>
        
            <button className="w-[135px] h-[44px] bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent cursor-pointer rounded-[50px] border border-[#FFD12E] font-sans ">Get Started </button>
        
    </div>

    );
 }
 export default Drive1stpageleft;