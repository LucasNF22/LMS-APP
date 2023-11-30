import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { BiSearch } from 'react-icons/bi';

type Props = {};

const Hero: FC<Props> = ( props ) => {
    return(
        <div className='w-full 1000px:flex items-center'>
            <div className='absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-full '/>
            <div className='1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10 '>
                <Image
                    src={require("../../../public/assets/4300_10_03-01.png")}
                    alt="Imagen Hero"
                    className='object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]'
                />
            </div>
            <div className='1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]'>
                <h2 className='dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[68%]'>
                    Mejora tu exeriencia de aprendizaje online
                </h2>
                <br />
                <p className='dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]'>
                    Tenemos más de 40 cursos y mas de 5000 alumnos registrados.
                    Encontrá el curso que buscas.
                </p>
                <br />
                <br />
                <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative'>
                    <input 
                        type="search" 
                        placeholder='Busca cursos'
                        className='bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin '
                    />
                    <div className='absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]'>
                        <BiSearch className="text-white" size={30} />
                    </div>
                </div>
                <br />
                <br />
                <div className='1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center'>
                    <Image 
                        src={require("../../../public/assets/01.jpg")}
                        alt='avatar'
                        className='rounded-full w-10 aspect-square'
                        
                    />
                    <Image 
                        src={require("../../../public/assets/02.jpg")}
                        alt='avatar'
                        className='rounded-full w-10 ml-[-20px] aspect-square'
                    />
                    <Image 
                        src={require("../../../public/assets/03.jpg")}
                        alt='avatar'
                        className='rounded-full w-10 ml-[-20px] aspect-square'
                    />
                    <p className='font-Josefin dark:text-[#edfff4] text-[#000000b4] 1000px:pl-3 text-[18px] font-[600]'>
                        Mas de 5000 personas ya confian en nosotros. {" "}
                        <Link 
                            href="/courses"
                            className='dark:text-[#46e256] text-[crimson]'
                        >
                            Ver cursos
                        </Link>
                    </p>
            </div>
            <br />
        </div>
        </div>
        
    )
}

export default Hero;