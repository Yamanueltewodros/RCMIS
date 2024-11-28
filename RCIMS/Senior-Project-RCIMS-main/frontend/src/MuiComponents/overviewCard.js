import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonIcon from "@mui/icons-material/Person";

const InfoCard = ({ title, total, increase, percentage, conditions }) => {
  return (
    <Card elevation={3} sx={{ borderRadius: 4, p: 2, minWidth: 250 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          {title} <InfoOutlinedIcon sx={{ fontSize: 16 }} />
        </Typography>
        {/* <Button className= 'icon-btn' variant="outlined" size="small">
          See Details
        </Button> */}
          <button
           class="bg-transparent align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 border border-gray-900 text-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] rounded-full"
           >
           see Details
         </button>
      </Box>

      <CardContent sx={{ padding: "8px 0 0 0" }}>
        <Box display="flex" alignItems="center" mb={1}>
          <PersonIcon sx={{ fontSize: 40, color: "#9AA0A6" }} />
          <Typography variant="h3" sx={{ fontWeight: "bold", ml: 2 }}>
            {total}
          </Typography>
          <Typography variant="body1" sx={{ color: "green", fontWeight: "bold", ml: 1 }}>
            +{increase}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#666" }}>
          {percentage}% {conditions}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
