import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, fetchUserBytoken, clearState } from "./UserSlice";
import { useHistory } from "react-router-dom";
import { ReactComponent as Logo } from "./logo.svg";

const Dashboard = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const { isFetching, isError } = useSelector(userSelector);
  useEffect(() => {
    dispatch(fetchUserBytoken({ token: localStorage.getItem("token") }));
  }, []);

  const { username, email } = useSelector(userSelector);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
      history.push("/login");
    }
  }, [isError]);

  const onLogOut = () => {
    localStorage.removeItem("token");

    history.push("/login");
  };

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await fetch("http://localhost:3001/blogs", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    setBlogs(await response.json());
  };

  return (
    <Fragment>
      <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
        <div class="container flex flex-wrap justify-between items-center mx-auto">
          <a href="/" class="flex items-center">
            <Logo class="mr-3 h-6 sm:h-9" alt="Blog Logo" />
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              SuperBlogApp
            </span>
          </a>

          <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <li>
              logged in as: {username}
              <br />
              email: {email}
            </li>
            <li>
              <button
                onClick={onLogOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div class="container mx-auto grid gap-6 grid-cols-3 grid-rows-3">
        {blogs.map((data) => {
          return (
            <div class="p-20 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {data.title}
                </h5>
              </a>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {data.description}
              </p>
              <a
                href="#"
                class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Read more
                <svg
                  class="ml-2 -mr-1 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default Dashboard;
