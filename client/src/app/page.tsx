import {Card, CardTitle} from "@/components/ui/card";
import React from "react";

const page = () => {
  return (
    <Card className="bg-background min-w-[85%] min-h-[80vh] mt-28 flex items-start justify-center p-8">
      <CardTitle className="text-4xl uppercase">Choose a theme</CardTitle>
      <div className="flex items-center justify-center">
        <div className="flex">
          <div className=""></div>
        </div>
      </div>
    </Card>
  );
};

export default page;
