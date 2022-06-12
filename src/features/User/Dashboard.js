import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userSelector, fetchUserBytoken, clearState } from './UserSlice';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const history = useNavigate();

  const dispatch = useDispatch();
  const { isFetching, isError } = useSelector(userSelector);
  useEffect(() => {
    dispatch(fetchUserBytoken({ token: localStorage.getItem('token') }));
  }, []);

  const { username, email } = useSelector(userSelector);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
      history('/login');
    }
  }, [isError]);

  const onLogOut = () => {
    localStorage.removeItem('token');

    history('/login');
  };

  return (
    <div className="container mx-auto">
      {isFetching ? (
        <TailSpin width="100" />
      ) : (
        <Fragment>
          <div className="container mx-auto">
            Welcome back <h3>{username}</h3>
          </div>

          <button
            onClick={onLogOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default Dashboard;
