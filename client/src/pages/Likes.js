import "../css/likes.css";
// import x from "../img/x.svg"
import heart from "../img/heart.png";
import message from "../img/msg.svg";
import ModalMatch from "../components/ModalMatch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const server_url = process.env.REACT_APP_SERVER_URL;
const static_url = server_url + "/static";

const Likes = () => {
  const navigate = useNavigate();
  const [likedPets, setLikedPets] = useState([]);
  const [petsLikedUserPet, setPetsLikedUserPet] = useState([]);
  const [pairPets, setPairPets] = useState([]);
  const [matchInfo, setMatchInfo] = useState({ isMatch: false });

  const [newIsMatch, setNewIsMatch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        server_url + "/api/user/getLikeAndLikedPetsAndPairs",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data;
    };

    fetchData().then((data) => {
      setLikedPets(data.likedPets);
      setPetsLikedUserPet(data.petsLikedUserPet);
      setPairPets(data.pairPets);
    });
  }, []);

  const clickLike = (petId) => {
    const fetchData = async () => {
      const response = await fetch(server_url + "/api/user/likePet", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          ID: petId,
        }),
      });
      if (response.status === 200) {
        return await response.json();
      } else if (response.status === 401) {
        alert("Авторизируйтесь пожалуйста 😘");
        navigate("/login");
        return "unauth";
      } else {
        alert("Произошла ошибка на сервере");
        return "err";
      }
    };

    fetchData().then((data) => {
      if (data === "err" || data === "unauth") {
        return;
      }
      setMatchInfo(data);
      setNewIsMatch(true);
    });
    navigate(0);
  };

  const clickDislike = (petId) => {
    const fetchData = async () => {
      await fetch(server_url + "/api/user/dislikePet", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          dislikedPetId: petId,
          confirmed: true,
        }),
      });
    };
    fetchData();
    navigate(0);
  };

  const checkProfileClick = (petId) => {
    navigate("/profile/" + petId);
  };

  return (
    <div className="content" style={{ paddingTop: 40 }}>
      {newIsMatch && <ModalMatch matchInfo={matchInfo} />}
      <h2>Питомцы, которым вы приглянулись 😍</h2>
      <div className="flex wrap petsbox">
        {petsLikedUserPet.map((pet) => (
          <div key={pet.ID} className="candidate">
            <img
              alt=""
              src={static_url + pet.photos[0].path}
              onClick={() => checkProfileClick(pet.ID)}
            />
            <h3>{pet.name}</h3>
            <div style={{ display: "flex" }}>
              <button onClick={() => clickDislike(pet.ID)}>
                <img alt="" src={require("../img/x.png")}/>
              </button>
              <button onClick={() => clickLike(pet.ID)}>
                <img alt="" src={heart} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {pairPets && <>
        <h2>С ними у вас пара 💌</h2>
      <div className="flex wrap petsbox">
        {pairPets.map((pet) => (
          <div
            key={pet.petID}
            className="pairs"
          >
            <img alt="" src={static_url + pet.petImagePath} onClick={() => checkProfileClick(pet.petID)}/>
            <h3>{pet.petName}</h3>
            <div className="contact">
              <button>
                <img alt="" src={message}/>
                <a href={pet.contact}>Написать</a>
              </button>
            </div>
          </div>
        ))}
      </div>
      </>}
      <h2>Ваши лайки 🫰</h2>
      <div className="flex wrap petsbox">
        {likedPets.map((pet) => (
          <div
            key={pet.ID}
            className="likes"
            onClick={() => checkProfileClick(pet.ID)}
          >
            <img alt="" src={static_url + pet.photos[0].path} />
            <h3>{pet.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Likes;
