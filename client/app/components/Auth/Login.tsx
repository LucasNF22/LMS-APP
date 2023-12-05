'use client'

import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles, label } from '../../../app/styles/style';

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    email: Yup.string().email("Email Inválido").required("Po favor ingrese su email"),
    pasword: Yup.string().required("Por favor ingrese su contraseña").min(6),
});

const Login:FC<Props> = (props: Props) => {

    const [show, setShow] = useState(false);

    const formik = useFormik({
        initialValues: { email: "", password: ""},
        validationSchema: schema,
        onSubmit: async({ email, password }) => {
            console.log(email, password);
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
      <div className='w-full'>
        <h1 className={`${styles.title}`}>
            Login en LMS
        </h1>
        <form onSubmit={handleSubmit}>
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
            <div className='w-full mt-5 relative mb-1'>
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
            </div>
        </form>
      </div>
    )
}

export default Login