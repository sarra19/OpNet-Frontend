/* eslint-disable */
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";

function Homepage() {
  const location = useLocation();
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URLS.getAllUsers);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    const userRole = searchParams.get("userRole");

    if (userId) {
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userRole", userRole);

    }
    fetchUsers();

  }, [location]);
 
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <div style={{ textAlign: "center" }}>
          <h1>Welcome to Our Professional Opportunities Platform</h1>
          <p>This is the homepage of your dashboard application.</p>
          <p>Here are some things you can do:</p>
          
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
              Go to Dashboard
            </button>
          </Link>
        </div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Homepage;
