import Agent from "@/components/Agent";
import React from "react";

const Page = () => {
  return (
    <>
      <h3>Interview Generation</h3>
      <Agent username='you' userId='32' type='generate'/>
    </>
  );
};

export default Page;
