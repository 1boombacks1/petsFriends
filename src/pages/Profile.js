import { useState } from "react";
import "../css/profile.css";
import girl from "../img/girl.svg";
const testawards = ["BIS-P", "BIS-V"];
const texttext =
  "The American Staffordshire Terrier is a loving, loyal, playful dog that loves to spend time with human family members. They are quite muscular for their size, which can make them a handful on walks if they aren't trained properly. They also have strong jaws, which they will use to chew out of boredom";
const Profile = () => {
  const [aboutMeInfo, setAboutMeInfo] = useState(texttext);

  const [isEdit, setIsEdit] = useState(false);
  const [awards, setAwards] = useState([]);
  const [haveAwards, setHaveAwards] = useState(false);
  const [images, setImages] = useState([
    require("../img/photo1.png"),
    require("../img/photo2.png"),
    require("../img/photo3.png"),
  ]);

  // Получение данных о питомце:
  // Кличка, возраст, порода, пол, награды в виде массива
  // родословная, цель, фото, текст о себе
  //   useEffect(() => {
  //     const fetchDataForPet = async () => {
  //       try {
  //         const response = await fetch("http://localhost:4000/api/breeds");
  //         const data = await response.json();
  //         setBreeds(data);
  //         console.log(data);
  //       } catch (error) {
  //         console.error("Error fetching breeds:", error);
  //       }
  //     };

  //     fetchBreeds();
  //   }, []);

  return (
    <div className="content sb profile">
      <div className="background-profile"></div>
      <div className="flex baseinfo">
        <img
          alt=""
          className="profileImg"
          src={require("../img/profileImg.png")}
        />
        <div>
          <h2>
            Aria
            <img className="sexicon" alt="" src={girl} />
          </h2>
          <p>American staffordshire terrier, 2 years old</p>
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
              <img alt="" src={img} />
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
                  {/*Из сервера информацию о цели */}Вязка
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
                  <span>Нету</span>
                </label>
              </div>
            ) : (
              <div className="flex">
                <div className="option">
                  {/*Из сервера информацию о цели */}Есть
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
                    <span>Нету</span>
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
                  {/*Из сервера информацию о цели */}Вязка
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
