import React, { useState } from "react";
import AddBoardModal from "./Modals/AddBoardModal";

const EmptyBoard = ({ type }) =>  {
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  return (
    <div className=" bg-white dark:bg-[#2b2c37] h-screen w-screen flex flex-col  items-center justify-center">
      <h3 className=" text-gray-500 font-bold">
        There are no boards available. Create a new board to get started
      </h3>
      <button
        onClick={() => {
          setBoardModalOpen(true);
        }}
        className="w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
      >
        + Add New Board
      </button>
      {isBoardModalOpen && (
        <AddBoardModal
          setBoardModalOpen={setBoardModalOpen}
        />
      )}
    </div>
  );
}

export default EmptyBoard;
