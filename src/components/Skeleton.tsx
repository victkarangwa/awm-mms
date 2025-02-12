// Filename - pages/index.js

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonLoading() {
  return (
    <div>
      <Skeleton className="h-32 my-4" />
    </div>
  );
}
