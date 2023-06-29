import React, { useState } from "react";

import AddColumnModal from "./Modals/AddColumnModal";

const EmptyColumn = ({}) =>  {
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  return (
    <div className=" bg-[#E9EFFA] dark:bg-[#2b2c37] h-screen w-screen flex flex-col  items-center justify-center">
      <h3 className=" text-gray-500 font-bold">
        There are no columns available. Create a new column to get started
      </h3>
      <button
        onClick={() => {
          setIsAddColumnModalOpen(true);
        }}
        className="w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#BB5450] py-2 rounded-full"
      >
        + Add New Column
      </button>
      {isAddColumnModalOpen && (
        <AddColumnModal
          setIsAddColumnModalOpen={setIsAddColumnModalOpen}
        />
      )}
    </div>
  );
}

export default EmptyColumn;
