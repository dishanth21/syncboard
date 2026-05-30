import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  async function login() {

    try {

      const response =
        await api.post(

          "/auth/login",

          {
            email,
            password
          }

        );

      localStorage.setItem(

        "token",

        response.data

      );

      navigate(
        "/dashboard"
      );

    } catch {

      alert(
        "Login Failed"
      );

    }
  }

  return (

    <div

      style={{

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
          "linear-gradient(135deg,#0f172a,#1e293b)"

      }}

    >

      <div

        style={{

          background: "#1f2937",

          padding: "40px",

          borderRadius: "16px",

          width: "380px",

          boxShadow:
            "0 10px 25px rgba(0,0,0,.4)"

        }}

      >

        <h1
          style={{
            textAlign: "center",
            color: "white"
          }}
        >

          SyncBoard

        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginBottom: "30px"
          }}
        >

          Realtime Project Management

        </p>

        <input

          placeholder="Email"

          onChange={(e) =>

            setEmail(
              e.target.value
            )

          }

          style={{

            width: "100%",

            padding: "14px",

            marginBottom: "15px",

            borderRadius: "8px",

            border: "none",

            background: "#374151",

            color: "white"

          }}

        />

        <input

          type="password"

          placeholder="Password"

          onChange={(e) =>

            setPassword(
              e.target.value
            )

          }

          style={{

            width: "100%",

            padding: "14px",

            marginBottom: "25px",

            borderRadius: "8px",

            border: "none",

            background: "#374151",

            color: "white"

          }}

        />

        <button

          onClick={login}

          style={{

            width: "100%",

            padding: "14px",

            border: "none",

            borderRadius: "8px",

            background: "#3b82f6",

            color: "white",

            fontSize: "16px",

            cursor: "pointer"

          }}

        >

          Login

        </button>

      </div>

    </div>

  );
}

export default LoginPage;