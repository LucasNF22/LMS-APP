import React from 'react';
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

const Verification = (props: Props) => {
  return (
    <div>Verification</div>
  )
}

export default Verification