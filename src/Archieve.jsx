import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
import List from '@mui/material/List';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Tooltip from '@mui/material/Tooltip';


const Archieve = (props) => {
    const { tabIndex, index, calls, singleCallClicked, fetchCallsData } = props;

    const unArhiveButtonClicked = async (event, id) => {
        event.preventDefault();
        event.stopPropagation();
        const updatedData = {
            is_archived: false
        }
        try {
            const response = await fetch(`https://aircall-backend.onrender.com/activities/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            fetchCallsData();
        } catch (error) {
        }
    };
    return (
        <div role="tabpanel"
             hidden={tabIndex !== index}
             id={`simple-tabpanel-${index}`}
             aria-labelledby={`simple-tab-${index}`}>
            {/*<Box >*/}
                {calls && calls.length > 0 ? (
                    <>
                        <label style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 5 }}>Archived Calls</label>
                        <List sx={{ width: '100%', maxWidth: 325, bgcolor: 'background.paper' }}>
                            {calls.map(item => (
                                <div key={item.id}>
                                    <ListItem button onClick={() => singleCallClicked(item.id)} sx={{
                                        borderRadius: '10px',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        margin:'5px 12px 0px 12px'
                                    }}
                                              secondaryAction={
                                                  <div onClick={(event) => unArhiveButtonClicked(event, item.id)}>
                                                      <Tooltip title="Unarchive call" placement="top"> <UnarchiveIcon color="primary" edge="end" /></Tooltip>
                                                  </div>
                                              }>
                                        <ListItemAvatar>
                                            {item.direction === "inbound" ? <PhoneCallbackIcon color="success" /> : <PhoneForwardedIcon color="primary" />}
                                        </ListItemAvatar>
                                        <ListItemText primary={item.from} secondary={item.call_type} />
                                    </ListItem>
                                </div>
                            ))}
                        </List>
                    </>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginTop: 50 }}>No archived calls.</p>
                )}
            {/*</Box>*/}
        </div>
    )
}

export default Archieve;