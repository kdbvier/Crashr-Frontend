import React from "react";
import "./styles.css";

const SkeletonBox = () => {
  return (
    <div className="SkeletonBox">
      {[1, 2, 3].map((n) => (
        <div key={n} className="SkeletonBox-card">
          <div className="SkeletonBox-avatar"></div>
          <div className="SkeletonBox-content-container">
            <div className="SkeletonBox-name"></div>
            <div className="SkeletonBox-country"></div>
          </div>
        </div>
      ))}
      <div className="shimmer-wrapper">
        <div className="shimmer"></div>
      </div>
    </div>
  );
};

export default SkeletonBox;
