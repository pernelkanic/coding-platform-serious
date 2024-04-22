
 import { useState } from 'react';
import erdos from '../assets/erdos.png';
import NavbarElements from './NavbarElements';
 function BlackBoxContainer (){
    
    const[logout, setlogout] = useState(false);
    return(
        <>
            <div  className='bg-black pt-5  pl-5  w-[60rem] flex m-auto  '>
            <div className=''> 
                
                <img src={erdos} alt=""   
                width={250}
                height={250}
                 />
                <NavbarElements 
                    setlogout = {setlogout}
                />
            </div>
            </div>
        </>
    )
 }
 export default BlackBoxContainer;