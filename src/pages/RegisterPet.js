import React, { useEffect, useState } from 'react';
import '../css/registerPet.css'
import { Navigate } from 'react-router-dom';

const RegisterPet = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState();
  const [sex, setSex] = useState();
  const [petType, setPetType] = useState();
  const [breed, setBreed] = useState(0);
  const [goal, setGoal] = useState();

  const [breeds, setBreeds] = useState([]);

  const [ok, setOk] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
        try {
          const response = await fetch('http://localhost:4000/api/breeds');
          const data = await response.json();
          setBreeds(data);
          console.log(data)
        } catch (error) {
          console.error('Error fetching breeds:', error);
        }
      };

      fetchBreeds();
  }, [])

  const submit = async (e) => {
    e.preventDefault()

    const response = await fetch("http://localhost:4000/api/registerPet", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        petType,
        name,
        age,
        sex,
        breed,
        goal
      }),
    });

    if (response.status === 502) {
        alert("Произошла ошибка")
        return
    }

    setOk(true);
  }

  if (ok) {
    return <Navigate to={"/match"} />
  }

  return (
    <div className="main-container">
      <div className="img-container">
        <img src="../Dude_anketa.png" alt="" />
      </div>
      <div className="form-container">
        <form onSubmit={submit} className="registration-form">
          <h1>Профиль питомца</h1>
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
            <label htmlFor="sex">
              Пол:
              <span className="sub-label">Выбери один из</span>
            </label>
            <div className='radio-group'>
              <input
                type="radio"
                name='sex'
                onChange={() => setSex(true)}
              />
              <label htmlFor="male">Муж.</label>
              <input
                type="radio"
                name='sex'
                onChange={() => setSex(false)}
              />
              <label htmlFor="female">Жен.</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="petType">
              Какой питомец:
              <span className="sub-label">Выбери один из</span>
            </label>
            <div className='radio-group'>
              <input
                type="radio"
                name='pet'
                onChange={() => setPetType(true)}
              />
              <label htmlFor="dog">Собака</label>
              <input
                type="radio"
                name='pet'
                onChange={() => setPetType(false)}
              />
              <label htmlFor="cat">Кот</label>
            </div>
          </div>

          <label htmlFor="breed">Порода:</label>
          <select id="breed" value={breed} onChange={(e) => setBreed(parseInt(e.target.value))}>
            <option value="">Выберите породу</option>
            {breeds.map((breed) => (
                <option key={breed.ID} value={breed.ID}>
                    {breed.BreedName}
                </option>
            ))}
          </select>

          <div className="form-group">
            <label htmlFor="goal">Цель:</label>
            <div className='radio-group'>
              <input
                type="radio"
                name='goal'
                onChange={() => setGoal(true)}
              />
              <label htmlFor="mating">Вязка</label>
              <input
                type="radio"
                name='goal'
                onChange={() => setGoal(false)}
              />
              <label htmlFor="findFriends">Найти друзей</label>
            </div>
          </div>

          <button type="submit" className="rounded-button">Выполнить</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPet;
