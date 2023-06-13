import { useState, useEffect } from "react";
import "../css/profile.css";
import girl from "../img/girl.svg";
import boy from "../img/boy.svg";
const testawards = ["BIS-P", "BIS-V"];
// const texttext =
//   "The American Staffordshire Terrier is a loving, loyal, playful dog that loves to

const static_url = "http://localhost:4000/static"

const Profile = () => {
  //Основная информация
  const [name, setName] = useState("")
  const [sex, setSex] = useState(true)
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState(0)
  const [images, setImages] = useState([]);
  const [aboutMeInfo, setAboutMeInfo] = useState("");

  const [goal, setGoal] = useState(true)
  const [pedigree, setPedigree] = useState(true)
  const [awards, setAwards] = useState([]);

  const [haveAwards, setHaveAwards] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  // Получение данных о питомце:
  // Кличка, возраст, порода, пол, награды в виде массива
  // родословная, цель, фото, текст о себе
    useEffect(() => {
      const fetchDataForPet = async () => {
        try {
          const response = await fetch("http://localhost:4000/api/user/getMe", {
            credentials: "include"
          });
          const data = await response.json();
          setName(data.name);
          setSex(data.sex);
          setBreed(data.breed);
          setAge(data.age);
          setAboutMeInfo(data.aboutMeInfo);
          setImages(data.photos)
          setGoal(data.goal)
          setPedigree(data.pedigree)
          setAwards(data.awards)

          console.log(images)
        } catch (error) {
          console.error("Error fetching petInfo:", error);
        }
      };

      fetchDataForPet();
    }, []);

  return (
    <div className="content sb profile">
      <div className="background-profile"></div>
      <div className="flex baseinfo">
        <img
          alt=""
          className="profileImg"
          src={static_url + images[0]}
        />
        <div>
          <h2>
            {name}
            <img className="sexicon" alt="" src={sex ? boy : girl} />
          </h2>
          <p>{breed}, {age} years old</p>
          <div className="flex" style={{ marginTop: 33 }}>
            <button>Изменить фото профиля</button>
            <button
              className={isEdit ? "active" : ""}
              onClick={() => setIsEdit(!isEdit)}
            >
              Изменить профиль
            </button>
          </div>
        </div>
      </div>
      <div className="flex">
        <div>
          <h2>Обо мне</h2>
          {isEdit ? (
            <textarea onChange={(e) => setAboutMeInfo(e.target.value)}>
              {aboutMeInfo}
            </textarea>
          ) : (
            <p>{aboutMeInfo}</p>
          )}
          <h2>Photos</h2>
          <div className="photos flex wrap">
            {images.map((img) => (
              <img alt="" src={static_url + img} />
            ))}
            {isEdit && (
              <label className="addImg">
                <input
                  type="file"
                  accept="image/gif, image/jpeg, image/png"
                  name="img"
                />
                <span>+</span>
              </label>
            )}
          </div>
          {isEdit && (
            <button onClick={() => setIsEdit(!isEdit)} className="submitInfo">
              Подтвердить изменения
            </button>
          )}
        </div>
        <div style={{ margin: "0 auto" }}>
          <div>
            <h2>Цель</h2>
            {isEdit ? (
              <div className="flex">
                <label>
                  <input type="radio" name="goal" value={false} />
                  <span>Найти друзей</span>
                </label>
                <label>
                  <input type="radio" name="goal" value={true} />
                  <span>Вязка</span>
                </label>
              </div>
            ) : (
              <div className="flex">
                <div className="option">
                  {goal ? "Вязка" : "Найти друзей"}
                </div>
              </div>
            )}
          </div>
          <div>
            <h2>Родословная</h2>
            {isEdit ? (
              <div className="flex">
                <label>
                  <input type="radio" name="pedigree" value={true} />
                  <span>Есть</span>
                </label>
                <label>
                  <input type="radio" name="pedigree" value={false} />
                  <span>Нет</span>
                </label>
              </div>
            ) : (
              <div className="flex">
                <div className="option">
                {pedigree ? "Есть" : "Нет"}
                </div>
              </div>
            )}
          </div>
          <div>
            <h2>Награды</h2>
            {isEdit ? (
              <>
                <div className="flex">
                  <label>
                    <input
                      onChange={() => setHaveAwards(true)}
                      type="radio"
                      name="awards"
                      value={true}
                      //   checked={frombackBul}
                    />
                    <span>Есть</span>
                  </label>
                  <label>
                    <input
                      onChange={() => setHaveAwards(false)}
                      type="radio"
                      name="awards"
                      value={false}
                      //   checked={!frombackBul}
                    />
                    <span>Нет</span>
                  </label>
                </div>
                {haveAwards && (
                  <>
                    {testawards.map((award) => (
                      <div key={award} className="option award">
                        {award}
                      </div>
                    ))}
                    <div className="awardform">
                      <div className="mark"/>
                      <input
                        className="award"
                        type="text"
                        placeholder="Добавить награду"
                        name="inputAward"
                      />
                      <div className="go">→</div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex">
                <div className="option award">
                  {awards.length > 0 ? awards.map((award) => {
                    <div key={award} className="option award">
                      {award}
                  </div>
                  }) : "Нет"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
