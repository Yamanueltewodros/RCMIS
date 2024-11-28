import {Box, Card, CardContent, Typography, CardActions, Button, CardMedia, IconButton} from "@mui/material";
import Doc from './Doc1.jpg';
import './CareTeamCard.css'; // Importing CSS for styling

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SendIcon from '@mui/icons-material/Send';
import { blue } from "@mui/material/colors";

const ProCard = () =>{
    return(
        <Box>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component= 'img'
                    height={140}
                    image={Doc}
                >
                    
                </CardMedia>
                <CardContent>
                   <Typography gutterBottom variant="h5" component= "div">
                      DR. Demsesew Ashebir
                   </Typography>
                   <Typography gutterBottom variant="body2" component= "div">
                      Highly Skilled at Medemsesesing Patients with his terrorizing approch 
                   </Typography>
                   <CardActions> 
                        <button className="icon-btn" onClick={()=>{}}><CalendarMonthIcon /></button>
                        <button className="icon-btn">
                        <SendIcon onClick={{}} sx={{color: blue[200 ]}}/>
                        </button>
                        
                        {/* <IconButton className="icon-btn"><SendIcon className="" onClick={{}}></SendIcon></IconButton> */}
                   </CardActions>
                </CardContent>
            </Card>
        </Box>
    );

}


export default ProCard