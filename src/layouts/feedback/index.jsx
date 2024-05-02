/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import CaseFeedback from './CaseFeedback';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';

function Feedback() {
  const [searchResult, setSearchResult] = useState([]);
  const [companyNames, setCompanyNames] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const fetchStudentInterviews = async () => {
      try {
        const userId  = sessionStorage.getItem('userId');
        console.log('ID du user récupéré utilisant sessionStorage :', userId ); 
        if (!userId ) {
          console.error("ID de user non trouvé dans le sessionStorage");
          return;
        }
        const response = await axios.get(`http://localhost:5000/interviews/getInterviewsByStudentId/${userId}`);
        const interviewsByCompany = {};
        response.data.forEach(interview => {
          const companyId = interview.assignedCompanyId;
          if (!interviewsByCompany[companyId]) {
            interviewsByCompany[companyId] = [];
          }
          interviewsByCompany[companyId].push(interview);
        });
        setSearchResult(interviewsByCompany);
        setSearchPerformed(true);
      } catch (error) {
        console.error('Error searching interviews:', error.message);
        setSearchResult([]);
        setSearchPerformed(true);
      }
    };
    fetchStudentInterviews();
  }, []);

  useEffect(() => {
    const fetchCompanyNames = async () => {
      const companyNamesObj = {};
      const companyIds = Object.keys(searchResult);
      for (const companyId of companyIds) {
        try {
          const response = await axios.get(`http://localhost:5000/user/get/${companyId}`);
          const { firstname, lastname } = response.data;
          const companyName = `${firstname} ${lastname}`;
          companyNamesObj[companyId] = companyName;
        } catch (error) {
          console.error(`Error fetching company name for company ID ${companyId}:`, error);
          companyNamesObj[companyId] = 'Entreprise inconnue';
        }
      }
      setCompanyNames(companyNamesObj);
    };
    fetchCompanyNames();
  }, [searchResult]);

  return (
    <DashboardLayout>
      <MDBox mt={15} mb={5} >
        <Typography variant='h1' mt={-7} display="flex" justifyContent="center">FeedBack</Typography> 
        <Box mt={3}>
          <Grid >
            {searchPerformed && Object.keys(searchResult).map(companyId => (
              <Grid item xs={12} key={companyId}mt={5}>
                <Box>
                  <h3 style={{ color: 'red', display: 'inline-block' }} >Entreprise:</h3>
                  <h3 style={{ display: 'inline-block' , marginLeft: "15px" }}>{companyNames[companyId]}</h3>
                </Box>
                <Box display="flex" flexWrap="wrap" justifyContent="center">
                  {searchResult[companyId].map((interview, index) => (
                    <Grid item xs={4} key={index}>
                      <CaseFeedback interview={interview} validated={interview.validated} />
                    </Grid>
                  ))}
                </Box>
              </Grid>
            ))}
            {searchPerformed && Object.keys(searchResult).length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1"> Vous n'avez pas encore de feedback !</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </MDBox>
    </DashboardLayout>
  );
}

export default Feedback;
