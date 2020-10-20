import React, { useState, useEffect } from "react";
import api from "../../services/api";

import "./index.css";

import imgLogo from "../../assets/imgs/LogotipoAmigoSecreto.png";

export default function Home() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createError, setCreateError] = useState("");
  const [alertEmail, setAlertEmail] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const cleanFields = () => {
    setName("");
    setEmail("");
    setCreateError("");
    setAlertEmail("");
  };

  const createSecretFriend = async () => {
    if (name.length === 0) {
      setCreateError("Preencha todos os campos!");
    } else {
      const response = await api.post("/create-user", {
        name: name,
        email: email,
        friend: "",
      });

      if (response.data.message === "User already exists") {
        setCreateError("Esse e-mail já foi cadastrado!");
      } else {
        setData(response.data.users);
        cleanFields();
      }
    }
  };

  const loadSecretFriend = async () => {
    const response = await api.get("/list-users");
    // console.log(response.data.users);
    setData(response.data.users);
  };

  const delet = async (_id) => {
    const response = await api.delete(`/delete-user?id=${_id}`);
    // console.log(response.data);
    if (response.data.error === false) {

      const newData = data.filter((item) => item._id !== _id);
      // console.log(newData);
      setData(response.data.info);
      cleanFields();
    }
  };

  const sendMail = async (newArray) => {
    // console.log(newArray)
    const response = await api.post("/send-mail", newArray);
    // console.log(response.data.users)
    if (response.data.error === false) {
      setAlertEmail("E-mail's enviados");
      setData(response.data.users);
    }
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const sendEmailsSecretFriend = (array) => {
    let arr = array.filter((item) => item.name !== "");
    let newArray = arr;

    let currentIndex = newArray.length,
      temporaryValue,
      randomIndex;

    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex--);

      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;

      newArray.map(
        (item, index) => (newArray[index].friend = array[index].name)
      );
    }

    return sendMail(newArray);
  };

  const sizeOfThings = () => {
    return window.innerHeight;
  };

  const noInfos = {
    height: "100vh",
  };

  const infos = {};

  const activeButton = {
    backgroundColor: "#202024",
    color: "#fff",
  };

  const notActiveButton = {
    backgroundColor: "#7d7d82",
    color: "#5c5caf",
  };

  useEffect(() => {
    loadSecretFriend();
  }, []);

  return (
    <div id="box" style={{ height: sizeOfThings() }}>
      <div
        className="container-left"
        style={data.length === 0 ? noInfos : infos}
      >
        <div className="container-logo">
          <img
            src={imgLogo}
            alt="Imagem Logo"
            style={{ resize: "horizontal", width: "50%", height: "8rem" }}
          />
        </div>
        <div className="container-left-title">
          <span>#Cadastre seus amigos</span>
        </div>

        <div className="register">
          <form action="" onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="nome"
              value={name}
              onChange={handleChangeName}
            />
            <input
              type="email"
              placeholder="e-mail"
              value={email}
              onChange={handleChangeEmail}
            />
          </form>

          <div className="button">
            <input
              type="submit"
              value="Inserir"
              onClick={() => {
                createSecretFriend();
              }}
            />
          </div>
          <div className="error">{createError !== "" && createError}</div>
        </div>
      </div>
      {data.length > 0 && (
        <div className="container-right">
          <div className="list">
            <div className="title">
              <span>#Lista de Amigos</span>
              <span>{data.length} amigo(s)</span>
            </div>
            <div className="list-friends">
              <ul>
                {data.map((item) => (
                  <li key={item._id}>
                    <div className="card">
                      <span>
                        {item.name && item.name.length > 20
                          ? item.name.substring(0, 24 - 3) + "..."
                          : item.name}
                      </span>
                      <span>
                        {item.email && item.email.length > 20
                          ? item.email.substring(0, 24 - 3) + "..."
                          : item.email}
                      </span>
                      <span>
                        {item.friend !== "" && `Amigo: `}

                        {item.friend && item.friend.length > 20
                          ? item.friend.substring(0, 24 - 3) + "..."
                          : item.friend}
                      </span>
                    </div>
                    <div className="button" onClick={() => delet(item._id)}>
                      <input type="submit" value="X" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="generator-button">
              <input
                style={data.length > 1 ? activeButton : notActiveButton}
                disabled={data.length > 1 ? false : true}
                type="submit"
                value="Gerar"
                onClick={() => {
                  sendEmailsSecretFriend(data);
                }}
              />
            </div>

            <div className="error">{alertEmail !== "" && alertEmail}</div>
          </div>
        </div>
      )}
    </div>
  );
}
