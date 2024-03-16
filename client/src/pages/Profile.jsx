import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from '../redux/user/userSlice';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '', // Initialize with an empty string or currentUser.password if available
    avatarUrl: currentUser.avatarUrl, // Initialize with current avatar URL
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file && currentUser && currentUser._id) {
      handleFileUpload(file);
    }
  }, [file, currentUser]);

  const handleFileUpload = async (file) => {
    try {
      if (!currentUser || !currentUser._id) {
        console.error('User not authenticated or missing ID.');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const updateUrl = `/api/user/update/${currentUser._id}`;

      const res = await axios.post(updateUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded * 100) / total);
          setProgress(progress);
        },
      });

      console.log('File uploaded successfully!', res.data);

      // Ensure that 'updatedUser' is defined in the server response
      const updatedUser = res.data.updatedUser;
      if (updatedUser) {
        // Update UI with new avatar image URL
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatarUrl: updatedUser.avatarUrl,
        }));
      } else {
        console.error(
          'Invalid response format or missing updatedUser:',
          res.data
        );
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.error(
          'Authentication error: Redirect to login page or handle accordingly.'
        );
      } else {
        console.error('File upload failed!', err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.post(
        `/api/user/update/${currentUser._id}`,
        formData
      );
      const data = res.data;

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        // Handle failure, show error message, etc.
      } else {
        // Assuming the server returns the updated user data after the form submission
        const updatedUser = data.updatedUser;
        dispatch(updateUserSuccess(updatedUser));
        setUpdateSuccess(true);
        // Redirect or show success message based on your needs
        // Example: history.push('/profile') or set a success state to display a message
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      const data = res.data;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <div className="flex flex-col items-center justify-center gap-1">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatarUrl} // Use formData.avatarUrl
            alt="profile-img"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
          <div className="text-center h-[16px]">
            {progress > 0 && <progress value={progress} max={100} />}
          </div>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          id="username"
          className="border p-3 rounded-md"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={formData.email}
          id="email"
          className="border p-3 rounded-md"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-md"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-md p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex items-center justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  );
};

export default Profile;
