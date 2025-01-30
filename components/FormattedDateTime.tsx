import React from "react";
import { cn, formatDateTime } from "@/lib/utils";

export const FormattedDateTime = ({
  date,
  className,
  ind
}: {
  date: string;
  className?: string;
  ind?:boolean
}) => {
  return (
    <p className={cn("body-1 text-light-200 flex items-center gap-2", className)}>
      {formatDateTime(date)} 
      {ind && <span className=" bg-red text-white py-1 px-2 rounded-xl ">View</span>} 
    </p>
  );
};
export default FormattedDateTime;
