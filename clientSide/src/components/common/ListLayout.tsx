import { useEffect } from "react";
import profile from "@/assets/muhammadAli.jpg";
import Friends from "../Friends/Friends";
import api from "@/api/axiosApi";
const ListLayout = () => {
  let value: number = 1;
  const test: number[] = [1, 2, 3];
  const fetchAllFriendsData = async (value: number) => {
    try {
      await api.get(`user/friend/${value}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllFriendsData(value);
  }, []);
  return (
    // List All chat
    <div className="flex flex-col">
      {/* Search  */}
      <div className="mb-4">
        <form className="max-w-md mx-auto">
          {/*  for="default-search" */}
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2 text-[12px] leading-5  text-gray-900 border border-gray-300 rounded-[16px] ps-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              required
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        {test.map(() => (
          <Friends name="Farhan" image={profile} />
        ))}
      </div>
    </div>
  );
};

export default ListLayout;
