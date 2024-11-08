import React from "react";
import { Text } from "react-native";

interface OpenClosedStatusProps {
  openAt: string;
  closeAt: string;
  openText: string;
  closeText: string;
}

const OpenClosedStatus: React.FC<OpenClosedStatusProps> = ({openAt, closeAt, openText, closeText}) => {
  const getStatus = () => {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    const [openHour, openMinute] = openAt.split(":").map(Number);
    const [closeHour, closeMinute] = closeAt.split(":").map(Number);

    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const openTotalMinutes = openHour * 60 + openMinute;
    const closeTotalMinutes = closeHour * 60 + closeMinute;

    if (
      currentTotalMinutes >= openTotalMinutes &&
      currentTotalMinutes < closeTotalMinutes
    ) {
      return openText;
    } else {
      return closeText;
    }
  };

  return (
    <Text
      style={{
        fontSize: 14,
        color: getStatus() === openText ? "#00502A" : "#FF0000",
      }}
    >
      {getStatus()}
    </Text>
  );
};

export default OpenClosedStatus;
