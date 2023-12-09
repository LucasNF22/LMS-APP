'use client'

import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../styles/style';

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    name: Yup.string().required("ingrese su nombre"),
    email: Yup.string().email("Email Inválido").required("Po favor ingrese su email"),
    password: Yup.string().required("Por favor ingrese su contraseña").min(6),
});

const Signup:FC<Props> = ({ setRoute }) => {

    const [show, setShow] = useState(false);

    const formik = useFormik({
        initialValues: { name:"", email: "", password: ""},
        validationSchema: schema,
        onSubmit: async({ email, password }) => {
            setRoute("Verification")
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
      <div className='w-full'>
        <h1 className={`${styles.title}`}>
            Registrate en LMS
        </h1>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor="email" className={`${styles.label}`}>
                    Ingrese su email
                </label>
                <input 
                    type="text" 
                    name=""
                    value={ values.name }
                    onChange={ handleChange }
                    id="name"
                    placeholder='Su nombre'
                    className={`${
                        errors.name && touched.name && "border-red-500"
                    } ${styles.input}`}
                />
                { errors.name && touched.name && (
                        <span className='text-red-500 pt-2 block'>{errors.name}</span>
                    )
                }
            </div>
            <div className='mb-3'>
                <label htmlFor="email" className={`${styles.label}`}>
                    Ingrese su email
                </label>
                <input 
                    type="email" 
                    name=""
                    value={ values.email }
                    onChange={ handleChange }
                    id="email"
                    placeholder='email@email.com'
                    className={`${
                        errors.email && touched.email && "border-red-500"
                    } ${styles.input}`}
                />
                { errors.email && touched.email && (
                        <span className='text-red-500 pt-2 block'>{errors.email}</span>
                    )
                }
            </div>
            <div className='w-full relative mb-1'>
                <label htmlFor="email" className={`${styles.label}`}>
                    Ingrese su contraseña
                </label>
                <input 
                    type={ !show ? "password" : "show" } 
                    name='password'
                    value={ values.password }
                    onChange={ handleChange }
                    id='password'
                    placeholder='contraseña!@%'
                    className={`${
                        errors.password && touched.password && "border-red-500"
                    } ${styles.input}`}
                />
                {
                    !show ? (
                        <AiOutlineEyeInvisible 
                            className='absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className='absolute bottom-3 right-2 z-1 cursor-pointer'
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )
                }
                {
                    errors.password && touched.password &&(
                        <span className='text-red-500 pt-2 block'>{errors.password}</span>
                    )
                }
            </div>
            <div className='w-full mt-5'>
                <input 
                    type="submit" 
                    value="Registrar"
                    className={`${styles.button}`}
                />
                <br />
                <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                    O registrate con
                </h5>
                <div className='flex items-center justify-center mt-2'>
                    <FcGoogle size={30} className="cursor-pointer mr-2"/>
                    <AiFillGithub size={30} className="cursor-pointer ml-2"/>
                </div>
                <h5 className='text-center pt-4 font-Poppins text-[14px]'>
                    Ya tienes una cuenta?{" "}
                    <span
                        className='text-[#2190ff] pl-1 cursor-pointer'
                        onClick={ () => setRoute("Login") }
                    >
                    Ingresa    
                    </span>
                </h5>
                <br />
            </div>
        </form>
      </div>
    )
}

export default Signup;