import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  console.log(file);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await axios.post('/api/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded * 100) / total);
          setProgress(progress); // Update state variable with progress
        },
      });

      console.log('File uploaded successfully!' + res.data);
    } catch (err) {
      console.log('File upload failed!' + err);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile-img"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {progress > 0 && (
          <progress value={progress} max={100} /> // Display progress bar
        )}
        <input
          type="text"
          placeholder={currentUser.username}
          id="username"
          className="border p-3 rounded-md"
        />
        <input
          type="email"
          placeholder={currentUser.email}
          id="email"
          className="border p-3 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-md"
        />
        <button className="bg-slate-700 text-white rounded-md p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex items-center justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
