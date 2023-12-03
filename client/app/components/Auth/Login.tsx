'use client'

import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

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

  return (
    <div>

    </div>
  )
}

export default Login