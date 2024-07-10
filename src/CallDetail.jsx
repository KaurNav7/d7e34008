import React, { useState, useEffect } from 'react';
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


const Detail = ({ tabIndex, index, id }) => {

    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        // Function to fetch data from API
        const fetchDatas = async () => {
            try {
                if (id) {
                    const response = await fetch(`https://aircall-backend.onrender.com/activities/${id}`);
                    console.log('detailing', response);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const responseData = await response.json();
                    setUserInfo(responseData);
                    console.log('detailing', responseData);
                }
            } catch (error) {
            }
        };
        fetchDatas();
    }, [id]);

    return (
        <div hidden={tabIndex !== index}>
            <Grid container justifyContent="center" alignItems="center">
                <Grid item>
                    <Avatar style={{ width: 80, height: 80, marginBottom: 4,marginTop:15}} />
                </Grid>
            </Grid>
            <List>
                <ListItem sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    marginBottom:1,
                }}>
                    <CallIcon color="primary" fontSize="medium"></CallIcon>
                    <MessageIcon color="primary" fontSize="medium"></MessageIcon>
                    <VideocamIcon color="primary" fontSize="medium"></VideocamIcon>
                </ListItem>
                <Divider variant="middle" component="li" />
            </List>
            <List>
                <ListItem>
                    <ListItemText
                        primary="Call Information"
                        primaryTypographyProps={{ variant: 'h6' }}
                    />
                </ListItem>
                <Divider variant="middle" component="li" />
                <ListItem
                    key={userInfo && userInfo.id}
                    button
                    sx={{
                        padding: '5px 10px 5px 10px',
                        marginTop: '5px',
                    }}>
                    <ListItemAvatar>
                        {userInfo && userInfo.direction === 'inbound' ? (
                            <CallReceivedIcon color="success" />
                        ) : (
                            <CallMadeIcon color="primary" />
                        )}
                    </ListItemAvatar>
                    <ListItemText primary={userInfo && `${userInfo.direction} call ${userInfo.call_type}`} secondary={userInfo && `made by  ${userInfo.from}`} />
                </ListItem>
                <Divider variant="middle" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <AccessTimeIcon color="primary"></AccessTimeIcon>
                    </ListItemAvatar>
                    <ListItemText primary={userInfo && `Last for ${userInfo.duration} sec`} secondary={userInfo && userInfo.is_archived == true ? 'Archived' : 'Not archived'} />
                </ListItem>
            </List>
        </div>
    )
}

export default Detail;