import axios from "axios";

export function getUserData() {
  return JSON.parse(localStorage.getItem("userData"));
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function setUserData(userData) {
  return localStorage.setItem("userData", JSON.stringify(userData));
}

export function setAccessToken(accessToken) {
  localStorage.setItem("accessToken", accessToken);
}

export function setRefreshToken(refreshToken) {
  localStorage.setItem("refreshToken", refreshToken);
}

export function removeUserData() {
  localStorage.removeItem("userData");
}

export function removeAccessToken() {
  localStorage.removeItem("accessToken");
}

export function removeRefreshToken() {
  localStorage.removeItem("refreshToken");
}

export function isLoggedIn() {
  const accessToken = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;
  return accessToken ? true : false;
}

export function LogIn({ accessToken, refreshToken, userData }) {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  setUserData(userData);
}

export function LogOut() {
  removeAccessToken();
  removeRefreshToken();
  removeUserData();
  localStorage.removeItem("role")
}

export async function RefreshAccessToken() {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/users/refresh`,
      {
        refreshToken: getRefreshToken(),
      },
      {
        headers: {},
      }
    );
    setAccessToken(response?.data?.accessToken);
    setRefreshToken(response?.data?.refreshToken);
  } catch (error) {
    LogOut();
    window.location.href = "/login";
  }
}
