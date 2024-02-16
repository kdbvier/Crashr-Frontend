import React from "react";

const Loading = () => {
  return (
    <div style={loadingStyle}>
      <img src="/loading.gif" style={loadingImg} />
    </div>
  );
};

export default Loading;
const loadingStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#000",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const loadingImg: React.CSSProperties = {
  width: "200px",
  height: "200px",
};

