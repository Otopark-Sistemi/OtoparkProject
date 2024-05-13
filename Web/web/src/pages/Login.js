import React, { useState } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const url = "http://192.168.35.217:8082/user/login";
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const navigate = useNavigate();

  // Giriş yapıldıktan sonra yönlendirme fonksiyonu
  const handleLoginSuccess = () => {
    navigate("/ParkingLotSetup");
  };

                   
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Giriş başarısız oldu. Lütfen tekrar deneyin.");
      }
      // Başarılı giriş işlemi
      console.log("Giriş başarılı");
      setError("");
      handleLoginSuccess();

      //navigate to ParkingLotSetup



      // İsteğe bağlı olarak, giriş başarılı olduğunda yönlendirme yapılabilir.
    } catch (error) {
        alert(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl text-center font-bold text-white mb-4">
          Giriş Yap
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-white">
              Kullanıcı Adı:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white">
              Şifre:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
