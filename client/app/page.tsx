"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";

interface Props {}

const Page: FC<Props> = (props) => {
  return ( 
    <div>
      <Heading 
        title="LMS APP"
        description="LMS APP es una plataforma para personas que quieran expandir sus conocimientos"
        keywords="Programacion, MERN, Redux, Machine Learning, NextJS, NodeJS, React"
      />
    </div>
  )
};

export default Page;
