'use client'

import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from './components/Header';
import Hero from './components/route/Hero';

interface Props {}

const Page: FC<Props> = (props) => {
  
  const [open, setOpen] = useState(false);
  const [activeIten, setActiveIten] = useState(0);
  const [route, setRoute] = useState("Login");


  return ( 
    <div>
      <Heading 
        title="LMS APP"
        description="LMS APP es una plataforma para personas que quieran expandir sus conocimientos"
        keywords="Programacion, MERN, Redux, Machine Learning, NextJS, NodeJS, React"
      />
      <Header 
        open={open}
        setOpen={setOpen}
        activeItem={activeIten}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
    </div>
  )
};

export default Page;
