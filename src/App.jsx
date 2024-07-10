import Header from './Header.jsx';
import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Feed from './Feed.jsx';
import Archieve from './Archieve.jsx';
import Detail from './CallDetail.jsx';
import AlertDialogSlide from './dialog.jsx';
import NavigationBottom from './NavigationBottom.jsx';

function App() {
  const [count, setCount] = useState(0)

    const [callData, setCallData] = useState(null);
    const [archieveData, setArchieveData] = useState(null);
    const [nonArchieveData, setNonArchieveData] = useState(null);
    const [error, setError] = useState(null);
    const [tab, setTab] = React.useState(0);
    const [callId, setCallId] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [previousPage,setPreviousPage]=React.useState(0);

    const fetchCallsData = async () => {
        try {
            const response = await fetch('https://aircall-backend.onrender.com/activities');
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();
            setCallData(responseData);
            const nonArchieveData = responseData.filter(item => item.is_archived === false);
            const archeveData = responseData.filter(item => item.is_archived === true);
            setArchieveData(archeveData);
            setNonArchieveData(nonArchieveData);
        } catch (error) {
            setCallData(null);
            setError('Error fetching data');
        }
    };

    useEffect(() => {
        fetchCallsData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleItemClick = (itemId) => {
        setCallId(itemId);
        setPreviousPage(tab);
        setTab(2);
    };

    const archiveAll = async () => {
        try {
            await Promise.all(
                callData.map(async (item) => {
                    const updatedData = {
                        is_archived: true
                    };

                    const response = await fetch(`https://aircall-backend.onrender.com/activities/${item.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to archive all items');
                    }
                })
            );

            fetchCallsData(); // Fetch data after successful archiveAll operation
        } catch (error) {
            console.error('Error archiving all items:', error);
            // Handle error if needed
        }
    }


    const dialogOpen = () => {
        setOpenDialog(true);
    };

    const dialogClose = (status) => {
        setOpenDialog(false);
        if (status == 'ok') {
            archiveAll();
        }

    };

    const handleBackButton=()=>{
        setTab(previousPage)
    }

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-[#233142] p-4" >
          <div className="border-1 h-full w-[350px] bg-white rounded-sm shadow-2" style={{ position: 'relative' }}>

              <Header/>
              <div className="container-view" >
                  {openDialog == true &&
                      <AlertDialogSlide openDialog={openDialog} handleClose={dialogClose}></AlertDialogSlide>}
                  {/*<Box>*/}
                      <Feed tabIndex={tab} index={0} calls={nonArchieveData} singleCallClicked={handleItemClick}
                            fetchCallsData={fetchCallsData}>
                      </Feed>
                      {
                          tab == 2 &&
                          <Detail handleBackButton={handleBackButton} tabIndex={tab} index={2} id={callId}>
                          </Detail>
                      }
                      <Archieve tabIndex={tab} index={1} calls={archieveData} singleCallClicked={handleItemClick}
                                fetchCallsData={fetchCallsData}>
                      </Archieve>

                      <NavigationBottom
                          tab={tab}
                          dialogOpen={dialogOpen}
                          handleTabChange={handleTabChange}
                          fetchCallsData={fetchCallsData}
                      />
                  {/*</Box>*/}
              </div>

          </div>
      </div>
    </>
  )
}

export default App
