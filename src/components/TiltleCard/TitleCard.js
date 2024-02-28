import React from "react";
import "./TitleCard.css"; // Stylesheet for the TitleCard component

const TitleCard = ({ title, onClick }) => {
  // Generate a random vibrant color
  const vibrantColor = () => {
    const colors = [
      "#FF5733",
      "#FFC300",
      "#33FFBD",
      "#338DFF",
      "#8D33FF",
      "#FF33E9",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      className="title-card"
      style={{ backgroundColor: vibrantColor() }}
      onClick={onClick}
    >
      <h2>{title}</h2>
    </div>
  );
};

export default TitleCard;
