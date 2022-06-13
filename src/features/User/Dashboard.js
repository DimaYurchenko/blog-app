import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, fetchUserBytoken, clearState } from "./UserSlice";
import Loader from "react-loader-spinner";
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


      <h1>Available blogs</h1>
      <ol>
        {blogs.map((data) => {
          return (
            <li>
              {data.title} {data.id}
            </li>
          );
        })}
      </ol>
    </Fragment>
  );
};

export default Dashboard;
