import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/profile.css";
import girl from "../img/girl.svg";
import boy from "../img/boy.svg";

const server_url = process.env.REACT_APP_SERVER_URL
const static_url = server_url + "/static";
const ProfilePet = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [pet, setPet] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDataForPet = async () => {
        const response = await fetch(
          server_url + "/api/user/getProfile/" + params.id,
          {
            credentials: "include",
          }
        );
        if (response.status === 401) {
          alert("Авторизируйтесь пожалуйста 😘");
          navigate("/login");
          return 401;
        } else if (response.status === 404) {
            alert("")
            navigate("/notfound")
            return 404
        }
        const data = await response.json();
        return data;
    };

    fetchDataForPet().then((data) => {
          if (data === 404 || data === 401) return;
        setLoading(false)
        setPet(data)

    });
  }, [navigate, params]);

  if (loading) {
    return "Загрузка"
  }

  return ( pet ?
    <div className="content sb profile">
      <div className="background-profile"></div>
      <div className="flex baseinfo">
        <img alt="" className="profileImg" src={static_url + pet?.photos[0]?.path} />
        <div>
          <h2>
            {pet?.name}
            <img className="sexicon" alt="" src={pet?.sex ? boy : girl} />
          </h2>
          <p>
            {pet?.breed.name}, {pet?.age} Y.O.
          </p>
        </div>
      </div>
      <div className="flex">
        <div>
          <h2>Обо мне</h2>
          <p>{pet?.aboutMeInfo}</p>
          <h2>Photos</h2>
          <div className="photos flex wrap">
            {/* <img alt="" src={static_url + pet?.photos[0]?.path} /> */}
            {pet?.photos.map((img) => (
              <img key={img.id} alt="" src={static_url + img.path} />
            ))
            }
          </div>
        </div>
        <div style={{ margin: "0 auto" }}>
          <div>
            <h2>Цель</h2>
            <div className="flex">
              <div className="option">
                {pet?.isMating ? "Вязка" : "Найти друзей"}
              </div>
            </div>
          </div>
          <div>
            <h2>Родословная</h2>
            <div className="flex">
              <div className="option">
                {pet?.pedigree ? "Есть" : "Нет"}
              </div>
            </div>
          </div>
          <div>
            <h2>Награды</h2>
            <div>
              {pet?.awards.length > 0 ? (
                pet?.awards.map((award) => (
                  <div key={award.name} className="option award">
                    {award.name}
                  </div>
                ))
              ) : (
                <div className="option">
                  <span>Нет</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
     :
     <h2>Пусто</h2>
  )
};
export default ProfilePet;
