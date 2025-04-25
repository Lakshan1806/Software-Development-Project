import { Link } from "react-router-dom";        

function Navbardrive(){
    const navItemsDrive=[
        {path:"/",label: "Drive"}
    ];
    const navItems=[
        
        {path:"/Overview",label: "Overview"},
        {path:"/Earnings",label: "Earnings"},
        {path:"/Contactus",label: "Contact Us"},

    ];

    const linkstyle="flex p-[10px] justify-center items-center gap-[10px]";
    return(
     <nav className="flex w-screen p-[0px 20px] justify-between items-center  top-[81px] ">
        <div className="flex p-[10px] justify-center items-center gap-[10px] text-black text-center stroke-black stroke-[1px] font-[Inter] text-[20px] non-italic font-[400] leading-none">
        {navItemsDrive.map((item) =>(
                <Link to={item.path} key={item.path}>
                    {item.label}
                    </Link>
            ))}
        </div>

        <div className="flex items-center gap-[39px]">
            {navItems.map((item) =>(
                <Link to={item.path} key={item.path} className={linkstyle}>
                    {item.label}
                    </Link>
            ))}
        </div>
        
     </nav>
    );
}

export default Navbardrive;