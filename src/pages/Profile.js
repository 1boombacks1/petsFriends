import { useState, useEffect } from "react";
import "../css/profile.css";
import girl from "../img/girl.svg";
import boy from "../img/boy.svg";

// const testawards = ["BIS-P", "BIS-V"];
// const texttext =
//   "The American Staffordshire Terrier is a loving, loyal, playful dog that loves to

const static_url = "http://localhost:4000/static";

const Profile = () => {
  //Основная информация
  const [name, setName] = useState("");
  const [sex, setSex] = useState(true);
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState(0);
  const [images, setImages] = useState([{"id" : 0, "url" : "/static"}]);
  const [aboutMeInfo, setAboutMeInfo] = useState("");

  const [goal, setGoal] = useState("");
  const [pedigree, setPedigree] = useState("");
  const [awards, setAwards] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [awardValue, setAwardValue] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  // Получение данных о питомце:
  // Кличка, возраст, порода, пол, награды в виде массива
  // родословная, цель, фото, текст о себе
  useEffect(() => {
    const fetchDataForPet = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/user/getMe", {
          credentials: "include",
        });
        const data = await response.json();
        setName(data.name);
        setSex(data.sex);
        setBreed(data.breed);
        setAge(data.age);
        setAboutMeInfo(data.aboutMeInfo);
        setGoal(data.goal ? "mating" : "friends");
        setPedigree(data.pedigree ? "have" : "not");
        setAwards(data.awards.filter(Boolean));

        let responseImages = []
        for (let i = 0; i < data.photos.length; i++) {
          responseImages.push({"id" : i, "url" : data.photos[i]})
        }
        setImages(responseImages)
      } catch (error) {
        console.error("Error fetching petInfo:", error);
      }
    };

    fetchDataForPet();
  }, [isEdit]);

  const handleAddAward = () => {
    setAwards([...awards, awardValue]);
    setAwardValue("");
  };

  const handleFileChange = (img) => {
    const file = img.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages([...previewImages, {"img" : file, "url" : reader.result, "id" : previewImages.length - 1}]);
      };
      reader.readAsDataURL(file);
    }
  };

  const clickDeletePreviewImg = (img) => {
    var updatedImgs = previewImages.filter((value) => img.target.id !== `${value.id}`)
    setPreviewImages(updatedImgs)
  }
  const clickDeleteProfileImg = (img) => {
    var updatedImgs = images.filter((value) => img.target.id !== `${value.id}`)
    setDeletedImages([...deletedImages, parseInt(img.target.id)+1])
    setImages(updatedImgs)
  }

  const clickChangeInfo = async () => {
    try {
      const formData = new FormData()
      formData.append("aboutMeInfo", aboutMeInfo)
      formData.append("goal", goal === "mating")
      formData.append("pedigree", pedigree === "have")
      formData.append("awards", awards)
      formData.append("deletedPhotos", deletedImages)
      previewImages.forEach((item, i) => formData.append("photo"+i, item.img))

      setPreviewImages([])
      setDeletedImages([])

      const response = await fetch("http://localhost:4000/api/user/updateInfo", {
          method : "PATCH",
          credentials: "include",
          body : formData
        });

      if (!response.ok) {
        alert("Произошла ошибка!😞")
        return
      }

      setIsEdit(false)

      //good
    } catch(error) {
      console.error("Error fetching new data:", error);
    }
  };

  return (
    <div className="content sb profile">
      <div className="background-profile"></div>
      <div className="flex baseinfo">
        <img alt="" className="profileImg" src={static_url + images[0].url} />
        <div>
          <h2>
            {name}
            <img className="sexicon" alt="" src={sex ? boy : girl} />
          </h2>
          <p>
            {breed}, {age} years old
          </p>
          <div className="flex" style={{ marginTop: 33 }}>
            <button>Изменить фото профиля</button>
            <button
              className={isEdit ? "active" : ""}
              onClick={() => setIsEdit(true)}
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
            <img alt="" src={static_url + images[0].url} />
            {isEdit ? (
              <>
                {images.slice(1).map((img) => (
                  <div id={img.id} key={img.url} onClick={clickDeleteProfileImg} className="editImg">
                    <img alt="" src={static_url + img.url} />
                  </div>
                ))}
                {previewImages.map((img) => (
                  <div id={img.id} key={img.url} onClick={clickDeletePreviewImg} className="editImg">
                    <img alt="" src={img.url} />
                  </div>
                ))}
                {images.length + previewImages.length < 6 && (
                  <label className="addImg">
                    <input
                      type="file"
                      accept="image/gif, image/jpeg, image/png"
                      name="img"
                      onChange={handleFileChange}
                    />
                    <span>+</span>
                  </label>
                )}
              </>
            ) : (
              images.slice(1).map((img) => <img key={img.url} alt="" src={static_url + img.url} />)
            )}
          </div>
          {isEdit && (
            <button onClick={clickChangeInfo} className="submitInfo">
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
                  <input
                    type="radio"
                    name="goal"
                    value="friends"
                    checked={goal === "friends"}
                    onChange={(check) => setGoal(check.target.value)}
                  />
                  <span>Найти друзей</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="goal"
                    value="mating"
                    checked={goal === "mating"}
                    onChange={(check) => setGoal(check.target.value)}
                  />
                  <span>Вязка</span>
                </label>
              </div>
            ) : (
              <div className="flex">
                <div className="option">{goal === "mating" ? "Вязка" : "Найти друзей"}</div>
              </div>
            )}
          </div>
          <div>
            <h2>Родословная</h2>
            {isEdit ? (
              <div className="flex">
                <label>
                  <input
                    type="radio"
                    name="pedigree"
                    value="have"
                    checked={pedigree === "have"}
                    onChange={(check) => setPedigree(check.target.value)}
                  />
                  <span>Есть</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="pedigree"
                    value="not"
                    checked={pedigree === "not"}
                    onChange={(check) => setPedigree(check.target.value)}
                  />
                  <span>Нет</span>
                </label>
              </div>
            ) : (
              <div className="flex">
                <div className="option">{pedigree === "have" ? "Есть" : "Нет"}</div>
              </div>
            )}
          </div>
          <div>
            <h2>Награды</h2>
            {isEdit ? (
              <>
                {awards.map((award) => (
                  <div key={award} className="option award">
                    {award}
                  </div>
                ))}
                <div className="awardform">
                  <div className="mark" />
                  <input
                    onChange={(value) => setAwardValue(value.target.value)}
                    className="award"
                    type="text"
                    placeholder="Добавить награду"
                    name="inputAward"
                    value={awardValue}
                  />
                  <div className="go" onClick={handleAddAward}>
                    →
                  </div>
                </div>
              </>
            ) : (
              <div>
                {awards.length > 0 ? (
                  awards.map((award) => (
                    <div key={award} className="option award">
                      {award}
                    </div>
                  ))
                ) : (
                  <div className="option">
                    <span>Нет</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
