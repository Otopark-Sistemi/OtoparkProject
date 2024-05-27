import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../img/bg-3.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ApıUrl } from "../components/ApıUrl";
import { AuthContext } from "../auth/AuthProvider";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLoginSuccess = () => {
    login();
    navigate("/home");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ApıUrl.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Giriş başarısız oldu. Lütfen tekrar deneyin.");
      }
      console.log("Giriş başarılı");
      setError("");
      handleLoginSuccess();
    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="relative w-full h-screen">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>
      <div className="relative z-10 flex justify-center items-center h-screen">
        <div className="h-2/5 w-1/3 p-8 shadow-2xl shadow-slate-300 rounded-lg opacity-100 bg-gradient-to-r from-purple-500 to-pink-500">
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
                className="form-input rounded-md bg-transparent border-[1px] border-white mt-1 p-1 block w-full text-white placeholder-white caret-white"
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
                className="form-input rounded-md bg-transparent border-[1px] border-white mt-1 p-1 block w-full text-white placeholder-white caret-white"
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
            {error && <div style={{ color: "red" }}>{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Giriş Yap
            </button>
          </form>
          <button
            onClick={handleSignUp}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Kullanıcı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

