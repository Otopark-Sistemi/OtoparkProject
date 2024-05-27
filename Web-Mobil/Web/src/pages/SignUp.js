import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../img/bg-3.jpg";
import "../App.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ApıUrl } from "../components/ApıUrl"; // Adjust path as needed

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler uyuşmuyor");
    } else {
      try {
        const newUser = {
          name: formData.name,
          surname: formData.surname,
          username: formData.username,
          password: formData.password,
        };

        const response = await fetch(ApıUrl.signup, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error("Kayıt işlemi başarısız oldu.");
        }

        console.log("Kayıt Başarılı!");
        console.log("Gönderilen Veriler:", newUser);
        setError("");

        // Redirect to login page after successful signup
        navigate("/");
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div
      style={{
        fontFamily: "",
      }}
      className="relative w-full h-screen"
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <div className="relative z-10 flex justify-center items-center h-screen">
        <div className="h-2/3 w-1/3 p-8 shadow-2xl shadow-slate-300 rounded-lg opacity-100 bg-gradient-to-r from-purple-500 to-pink-500">
          <h2 className="text-3xl text-center font-bold text-white mb-4">
            Kayıt Ol
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-white">
                Ad:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input rounded-md bg-transparent border-[1px] border-white mt-1 p-1 block w-full text-white placeholder-white caret-white"
                placeholder="Adınızı giriniz"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="surname" className="block text-white">
                Soyad:
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="form-input mt-1 p-1 rounded-md bg-transparent border-[1px] border-white block w-full text-white placeholder-white caret-white"
                placeholder="Soyadınızı giriniz"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-white">
                Kullanıcı Adı:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input mt-1 p-1 rounded-md bg-transparent border-[1px] border-white block w-full text-white placeholder-white caret-white"
                placeholder="Kullanıcı Adı giriniz"
                autoComplete="off"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-white">
                Şifre:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input mt-1 p-1 rounded-md bg-transparent border-[1px] border-white block w-full text-white placeholder-white caret-white"
                placeholder="Şifrenizi giriniz"
                autoComplete="off"
              />
              <div
                className="absolute right-2 top-9 cursor-pointer text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-white">
                Şifreyi Onayla:
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input mt-1 p-1 rounded-md bg-transparent border-[1px] border-white block w-full text-white placeholder-white caret-white"
                placeholder="Şifrenizi onaylayınız"
                autoComplete="off"
              />
              <div
                className="absolute right-2 top-9 cursor-pointer text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
