import React, { useContext, useEffect } from "react";
import { HomeLoadContext } from "../Pages/Home/Home";

//Scrapped

const ImageComponent = ({ src, alt = "Image", style = null, className }) => {
  const { addLoadObj, markLoadObj } = useContext(HomeLoadContext);

  useEffect(() => {
    addLoadObj(src);
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      onLoad={() => {
        markLoadObj(src);
      }}
    />
  );
};

export default ImageComponent;
