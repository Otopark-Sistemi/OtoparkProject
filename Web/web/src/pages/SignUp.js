import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

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

        const response = await fetch("http://192.168.35.217:8082/user/signup", {
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
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
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
              className="form-input mt-1 block w-full"
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
              className="form-input mt-1 block w-full"
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-white">
              Şifreyi Onayla:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
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
  );
};

export default SignUp;
