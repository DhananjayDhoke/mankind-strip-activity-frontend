import { useState } from "react";
import { BASEURL } from "../constant/constant";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";

const Login = () => {
  const [empcode, setEmpcode] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASEURL}/auth/login`, {
        empcode,
        password,
      });
      if (res.data.errorCode === "1") {
        console.log(res);
        const empcode= res?.data?.responseData?.empcode;
        const userId = res?.data?.responseData?.user_id;
        const sessionId = res?.data?.responseData?.sessionID;
        //const role = res?.data?.responseData?.role;
        const  userName = res?.data?.responseData?.userName;
        //const  reporting = res?.data?.responseData?.reporting;
        //console.log(empId);
        sessionStorage.setItem("IsUserLoggedIn", "true");
        sessionStorage.setItem("empId", empcode);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("sessionId", sessionId);
        //sessionStorage.setItem("role", role);
        sessionStorage.setItem("name", userName);
       // sessionStorage.setItem("reporting",reporting)
        navigate("/dashboard");
      } else {
        //console.log("details",res.response.data.details)
        setError("Invalid Credential");
      }
    } catch (error) {
      setError("Invalid Credential");
    }
  };

  return (
    <main className="bglogin">
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="card mb-3">
                  <div
                    className="card-body"
                    style={{ backgroundColor: "#fff", borderRadius: "5px" }}
                  >
                    <div className="d-flex justify-content-center py-4">
                      <div className="logo1 d-flex align-items-center w-auto">
                        <img src="/images/logo.png" alt="Logo" />
                      </div>
                    </div>

                    <form
                      className="row g-3"
                      onSubmit={handelSubmit}
                      noValidate
                    >
                      <div className="col-12">
                        {/* <label htmlFor="yourUsername" className="form-label">Employee Code</label> */}
                        <div className="input-group">
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Employee code"
                            onChange={(e) => {
                              setEmpcode(e.target.value);
                            }}
                            
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter your employee code.
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        {/* <label htmlFor="yourPassword" className="form-label">Password</label> */}
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          onChange={(e) => setPassWord(e.target.value)}
                          className="form-control"
                          id="yourPassword"
                          required
                        />
                        {error && (
                          <p style={{ color: "red", marginTop: "5px" }}>
                            {error}
                          </p>
                        )}
                        <div className="invalid-feedback">
                          Please enter your password!
                        </div>
                      </div>

                      <div className="col-12">
                        <button className="btn btn-success w-100" type="submit">
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
