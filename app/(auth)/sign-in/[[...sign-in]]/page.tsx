import { SignIn } from "@clerk/nextjs";

import React from "react";

const Sign = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-slate-400">
      <SignIn />
    </div>
  );
};

export default Sign;
