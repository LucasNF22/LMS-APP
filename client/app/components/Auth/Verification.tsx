import React, { useState, useRef, FC } from 'react';
import toast from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';



type Props = {
    setRoute: (route: string) => void;
};

type verifyNumber = {
  "0": string,
  "1": string,
  "2": string,
  "3": string,
};

const Verification:FC<Props> = ({setRoute}) => {
  
  const [ invalidError, setInvalidError] = useState<boolean>(false);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const verificationHandler = async() => {
    console.log('Verification Test');
    
  };

  const HandleInputChange = ( index:number, value:string ) => {
    setInvalidError(false);
    const newVerifyNumber = {...verifyNumber, [index]: value }
  };

  return (
    <div>
      Verification
    </div>
  )
}

export default Verification