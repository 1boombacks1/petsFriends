import React, { useEffect, useRef, useState } from "react";
import "../css/registerPet.css";
import { useNavigate } from "react-router-dom";

const server_url = process.env.REACT_APP_SERVER_URL

const RegisterPet = () => {
  const navigate = useNavigate()

  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [sex, setSex] = useState();
  const [petType, setPetType] = useState(true);
  const [breed, setBreed] = useState(0);
  const [goal, setGoal] = useState();

  const [selectedImg, setSelectedImg] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const [breeds, setBreeds] = useState([]);

  const filePicker = useRef(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch(server_url + "/api/breeds", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 401) {
          navigate("/login")
          alert("Авторизируйтесь пожалуйста 😘")
        }
        return data
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds().then((data) => {
      setBreeds(data);
      console.log(data);
    });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      alert("Загрузите фото, без фото невозможно продолжить!");
      return;
    }
    const formData = new FormData();
    formData.append("petType", petType);
    formData.append("name", name);
    formData.append("age", age);
    formData.append("sex", sex);
    formData.append("breed", breed);
    formData.append("goal", goal);
    formData.append("img", selectedImg);

    const response = await fetch(server_url + "/api/user/registerPet", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.status === 502) {
      alert("Произошла ошибка");
      return;
    }

    navigate("/match")
  };

  const handleFileChange = (img) => {
    const file = img.target.files[0];
    setSelectedImg(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL("");
    }
  };

  const handlePickPhoto = () => {
    filePicker.current.click();
  };

  return (
    <div className="main-container">
      <div className="img-container">
        <img src="../Dude_anketa.png" alt="" />
      </div>
      <div className="form-container">
        <form onSubmit={submit} className="registration-form">
          <h1>Профиль питомца</h1>
          <label htmlFor="photo">Фото:</label>
          <input
            ref={filePicker}
            className="hidden"
            onChange={handleFileChange}
            type="file"
            accept=".jpeg,.png,.jpg"
          />
          {previewURL && <img src={previewURL} alt="Preview" />}
          <button
            type="button"
            className="load-button"
            onClick={handlePickPhoto}
          >
            Загрузить фото
          </button>
          <label htmlFor="name">Кличка:</label>
          <input
            type="text"
            id="name"
            placeholder="Введите кличку питомца"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="age">Возраст:</label>
          <input
            type="text"
            id="age"
            placeholder="Введите возраст питомца"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />

          <div className="form-group">
            <label htmlFor="petType">
              Какой питомец:
              <span className="sub-label">Выбери один из</span>
            </label>
            <div className="radio-group">
              <input
                type="radio"
                name="pet"
                onChange={() => setPetType(true)}
              />
              <label htmlFor="dog">Собака</label>
              <input
                type="radio"
                name="pet"
                onChange={() => setPetType(false)}
              />
              <label htmlFor="cat">Кот</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sex">
              Пол:
              <span className="sub-label">Выбери один из</span>
            </label>
            <div className="radio-group">
              <input type="radio" name="sex" onChange={() => setSex(true)} />
              <label htmlFor="male">Муж.</label>
              <input type="radio" name="sex" onChange={() => setSex(false)} />
              <label htmlFor="female">Жен.</label>
            </div>
          </div>

          <label htmlFor="breed">Порода:</label>
          <select
            id="breed"
            value={breed}
            onChange={(e) => setBreed(parseInt(e.target.value))}
          >
            <option value="">Выберите породу</option>
            {petType ? breeds.filter((breed) => (breed.IsDog === true)).map((breed) => (
              <option key={breed.ID} value={breed.ID}>
              {breed.name}
            </option>
            )) :
            breeds.filter((breed) => breed.IsDog === false).map((breed) => (
              <option key={breed.ID} value={breed.ID}>
              {breed.name}
            </option>
            ))
            }
          </select>

          <div className="form-group">
            <label htmlFor="goal">Цель:</label>
            <div className="radio-group">
              <input type="radio" name="goal" onChange={() => setGoal(true)} />
              <label htmlFor="mating">Вязка</label>
              <input type="radio" name="goal" onChange={() => setGoal(false)} />
              <label htmlFor="findFriends">Найти друзей</label>
            </div>
          </div>
          <button type="submit" className="rounded-button">
            Выполнить
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPet;
