import React from "react";
import { Card, CardContent, Typography, Button, Box, Icon } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonIcon from "@mui/icons-material/Person";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
const InfoCard = ({ icon,title, total, increase, percentage, conditions }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 4, p: 2, minWidth: 250 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="semi-bold">
          {icon} {title}
        </Typography>
        <MoreHorizIcon />   
      </Box>

      <CardContent sx={{ padding: "10px 0 0 0" }}>
        <Box display="flex" padding= "10px" alignItems="center" mb={1}>
          
          <Typography variant="h3" sx={{ fontWeight: "bold", ml: 2 }}>
            {total}
          </Typography>
          <Typography variant="body1" alignItems="center" sx={{ color: "#3A9CED", fontWeight: "bold", ml: 1 }}>
           <span style={{background: "#e6f7ff", padding: "5px", borderRadius: "5px"}}></span> 
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: "semi-bold", color: "#666" }}>
           
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
