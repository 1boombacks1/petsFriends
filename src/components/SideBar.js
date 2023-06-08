import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/sidebar.css";

const sidebarNavItems = [
  {
    display: "Match",
    icon: (
      <img
        width="30"
        height="30"
        src="https://img.icons8.com/ios/50/1A1A1A/pets--v1.png"
        alt="pets--v1"
      />
    ),
    to: "/match",
    section: "match",
  },
  {
    display: "Profile",
    icon: (
      <img
        width="30"
        height="30"
        src="https://img.icons8.com/material-outlined/48/user--v1.png"
        alt="user--v1"
      />
    ),
    to: "/profile",
    section: "profile",
  },
  {
    display: "Likes",
    icon: (
      <img
        width="30"
        height="30"
        src="https://img.icons8.com/ios/50/like--v1.png"
        alt="like--v1"
      />
    ),
    to: "/likes",
    section: "likes",
  },
  {
    display: "Messages",
    icon: (
      <img
        width="30"
        height="30"
        src="https://img.icons8.com/ios/50/1A1A1A/speech-bubble--v1.png"
        alt="speech-bubble--v1"
      />
    ),
    to: "/messages",
    section: "messages",
  },
  {
    display: "Logout",
    icon: (
      <img
        width="30"
        height="30"
        src="https://img.icons8.com/ios/50/1A1A1A/exit--v1.png"
        alt="exit--v1"
      />
    ),
    to: "/logout",
    isModal: true,
    section: "logout",
  },
];

const dontShowRoutes = ["registration", "login", "registerPet"];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();
  const modalRef = useRef();
  const [x, setX] = useState(false);
  const navigate = useNavigate()

  const submitLogoutCofirmation = async () => {
    await fetch("http://localhost:4000/user/logout", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    modalRef.current.classList.remove("active")
    navigate('/login')
  };

  useEffect(() => {
    setTimeout(() => {
      const sidebarItem = sidebarRef.current.querySelector(
        ".sidebar__menu__item"
      );
      indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
      setStepHeight(sidebarItem.clientHeight);
    }, 50);
  }, []);

  // change active index
  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];

    const find = dontShowRoutes.find((item) => item === curPath);
    if (find) setX(true);
    if (!find) setX(false);
  }, [location]);

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];

    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <div className={`sidebar ${x ? "none" : ""}`}>
      <div ref={modalRef} className="shadowWrap">
        <div className="modalOut">
          <h4 style={{margin:10}}>Вы уверены что хотите выйти?</h4>
          <div className="buttons">
            <button onClick={() => submitLogoutCofirmation()}>Да</button>
            <button onClick={()=>modalRef.current.classList.remove("active")}>Нет</button>
          </div>
        </div>
      </div>
      <div className="sidebar__logo">PetsFriends</div>
      <div ref={sidebarRef} className="sidebar__menu">
        <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
            transform: `translateX(-50%) translateY(${
              activeIndex * stepHeight
            }px)`,
          }}
        ></div>
        {sidebarNavItems.map((item, index) =>
          item.isModal ? (
            <div
              onClick={() => modalRef.current.classList.add("active")}
              key={index}
              style={{cursor:'pointer'}}
            >
              <div
                className={`sidebar__menu__item ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <div className="sidebar__menu__item__icon">{item.icon}</div>
                <div className="sidebar__menu__item__text">{item.display}</div>
              </div>
            </div>
          ) : (
            <Link to={item.to} key={index}>
              <div
                className={`sidebar__menu__item ${
                  activeIndex === index ? "active" : ""
                }`}
              >
                <div className="sidebar__menu__item__icon">{item.icon}</div>
                <div className="sidebar__menu__item__text">{item.display}</div>
              </div>
            </Link>
          )
        )}
      </div>
      <h2 className="sloganText">
        Find love friends for your four-legged friend.{" "}
      </h2>
    </div>
  );
};

export default Sidebar;
