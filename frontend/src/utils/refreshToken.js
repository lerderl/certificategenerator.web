import React, { useEffect } from "react";

const TokenExpired = () => {
  const token = JSON.parse(localStorage.getItem("userData")).token;
  const getToken = useEffect(() => {}, []);
  return;
};

export default TokenExpired;
