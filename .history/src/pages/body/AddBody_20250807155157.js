import React from "react";
import UploadImage from "./add/UploadImage";

export default function AddBody() {
  return (
    <div className="bodyContainer">
      <h2>게시글 작성</h2>
      <UploadImage />
    </div>
  );
}