import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Burada authentication işlemleri yapılmalıdır.
      // Örneğin, bir API çağrısı ile kullanıcı bilgileri kontrol edilebilir.
      // Bu örnekte basitçe kullanıcı adını "admin" ve şifreyi "password" olarak kontrol ediyoruz.
      if (username === "admin" && password === "password") {
        setLoggedIn(true);
      } else {
        setError("Kullanıcı adı veya şifre yanlış.");
      }
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (loggedIn) {
    // Eğer kullanıcı giriş yaptıysa, admin sayfasına yönlendir.
    return <Navigate to="/home" />;
  }

  return (
      <div className="flex justify-evenly items-center h-screen flex-col   bg-gray-100">
         <h1 className="text-5xl font-bold">OTOPARK ADMİN PANELİ</h1>
      <div className="bg-zinc-400 shadow-md w-[800px]  rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Giriş Yap</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Kullanıcı Adı:
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Şifre:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};
