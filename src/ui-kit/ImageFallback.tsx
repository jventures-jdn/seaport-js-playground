import { useState } from "react";
const omit = require("lodash.omit");

type Image = JSX.IntrinsicElements["img"];
export type ImageTags = Partial<Image> & {
  innerRef?: Image["ref"];
  src: Image["src"];
  alt: Image["alt"];
  loading?: boolean;
  fallbackImage?: string;
};

export function ImageFallback(props: ImageTags) {
  const [onImageError, setOnImageError] = useState(false);
  return (
    <img
      {...omit(props, "innerRef", "fallbackImage")}
      src={
        onImageError || !props.src
          ? props.fallbackImage || "/static/media_fallback.jpg"
          : props.src
      }
      alt=""
      loading={props.loading || "lazy"}
      onError={(e) => {
        props.onError?.(e);
        setOnImageError(true);
      }}
    />
  );
}
