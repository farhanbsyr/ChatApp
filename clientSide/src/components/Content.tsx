import React from "react";
import ContentLayout from "./common/ContentLayout";

interface ContentProps {
  userId: number;
}

// nanti bisa berbagai content
const Content: React.FC<ContentProps> = ({ userId }) => {
  return (
    <>
      <ContentLayout idUser={userId} />
    </>
  );
};

export default Content;
