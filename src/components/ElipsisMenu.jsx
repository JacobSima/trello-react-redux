import React from 'react';

const ElipsisMenu = ({setIsEditBoardModalOpen, setIsDeleteModalOpen}) => {
  return (
    <div
      className={" absolute  top-16  right-5"}
    >
      <div className=" flex justify-end items-center">
        <div className=" w-40 text-sm z-50 font-medium shadow-md shadow-[#364e7e1a] bg-white dark:bg-[#20212c] space-y-4 py-5 px-4 rounded-lg  h-auto pr-12">
          <p
            onClick={() => {
              setIsEditBoardModalOpen(true);
            }}
            className=" cursor-pointer dark:text-gray-400 text-gray-700"
          >
            Edit Board
          </p>

          <p
            onClick={() => setIsDeleteModalOpen(true)}
            className=" cursor-pointer text-red-500"
          >
            Delete Board
          </p>
        </div>

      </div>
    </div>
  )
}

export default ElipsisMenu