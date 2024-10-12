import React, { useState } from "react";
import {
  FaList,
  FaFire,
  FaTh,
  FaUserCircle,
  FaArrowUp,
  FaBookmark,
  FaSearch,
  FaTimes,
  FaBolt,
} from "react-icons/fa"; 

const companies = [
  "Amazon", "Apple", "Adobe", "Microsoft", "Meta", "Netflix", "Google", "Tesla", "Intel", "IBM",
  "Zoom", "Yahoo", "Xiaomi", "Qualcomm", "Oracle", "Nike", "Spotify", "Uber", "Visa", "Walmart"
];

const initialBlogs = [
  {
    id: 1,
    image: "https://via.placeholder.com/100",
    title: "How to Create a Stunning UI in 2024",
    description: "Learn the latest trends in UI design to make your apps stand out.",
    upvoted: false, 
    saved: false, 
  },
  {
    id: 2,
    image: "https://via.placeholder.com/100",
    title: "The Power of Minimalism in Design",
    description: "Why less is more in today's digital age.",
    upvoted: false, 
    saved: false, 
  },
  {
    id: 3,
    image: "https://via.placeholder.com/100",
    title: "Top 10 JavaScript Frameworks for Modern Web Development",
    description: "Explore the best JavaScript frameworks for building fast and responsive web applications.",
    upvoted: false, 
    saved: false, 
  },
  {
    id: 4,
    image: "https://via.placeholder.com/100",
    title: "Understanding CSS Grid and Flexbox",
    description: "A deep dive into CSS Grid and Flexbox for responsive layouts.",
    upvoted: true, 
    saved: false, 
  },
  {
    id: 5,
    image: "https://via.placeholder.com/100",
    title: "React Hooks: A Complete Guide for Beginners",
    description: "Learn everything you need to know about React hooks to start building powerful components.",
    upvoted: false, 
    saved: true, 
  },
  {
    id: 6,
    image: "https://via.placeholder.com/100",
    title: "Web Development Trends to Watch in 2024",
    description: "Stay ahead of the curve with the latest web development trends and technologies.",
    upvoted: false, 
    saved: true, 
  },
  {
    id: 7,
    image: "https://via.placeholder.com/100",
    title: "Building a Scalable Backend with Node.js and Express",
    description: "Learn how to build a powerful and scalable backend using Node.js and Express.",
    upvoted: true, 
    saved: false, 
  },
  {
    id: 8,
    image: "https://via.placeholder.com/100",
    title: "SEO Best Practices for 2024",
    description: "Optimize your website and content to rank higher on search engines.",
    upvoted: true, 
    saved: true, 
  },
  {
    id: 9,
    image: "https://via.placeholder.com/100",
    title: "Mastering Asynchronous JavaScript with Promises and Async/Await",
    description: "A comprehensive guide to handling asynchronous code in JavaScript.",
    upvoted: false, 
    saved: false, 
  },
  {
    id: 10,
    image: "https://via.placeholder.com/100",
    title: "Introduction to TypeScript for JavaScript Developers",
    description: "Learn how TypeScript enhances JavaScript development with static typing.",
    upvoted: false, 
    saved: false, 
  },
  // Other blogs...
];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 16; // Show 16 blogs per page (4x4 grid)

  const [blogs, setBlogs] = useState(initialBlogs); // Updated to manage upvote/save states

  // State to toggle the Categories modal
  const [showCategories, setShowCategories] = useState(false);

  // State to control the mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage); // Calculate total pages

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Group companies alphabetically
  const alphabetizedCompanies = companies.sort().reduce((acc, company) => {
    const firstLetter = company[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(company);
    return acc;
  }, {});

  const toggleUpvote = (blogId) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, upvoted: !blog.upvoted } : blog
    ));
  };

  // Toggle save for a blog
  const toggleSave = (blogId) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, saved: !blog.saved } : blog
    ));
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.websiteName}>BlogSpace</span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ ...styles.navRight, ...styles.desktopNav }}>
          <div style={styles.navIcon}><FaList />&nbsp;List</div>
          <div style={styles.navIcon}><FaFire />&nbsp;Trending</div>
          <div
            style={styles.navIcon}
            onClick={() => setShowCategories(!showCategories)}
          >
            <FaTh />&nbsp;Categories
          </div>
          <div style={styles.navIcon}><FaUserCircle />&nbsp;Profile</div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div style={styles.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FaList />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <div
            style={styles.mobileMenuClose}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaTimes />
          </div>
          <div style={styles.mobileMenuItem}><FaList />&nbsp;List</div>
          <div style={styles.mobileMenuItem}><FaFire />&nbsp;Trending</div>
          <div
            style={styles.mobileMenuItem}
            onClick={() => {
              setShowCategories(!showCategories);
              setMobileMenuOpen(false);
            }}
          >
            <FaTh />&nbsp;Categories
          </div>
          <div style={styles.mobileMenuItem}><FaUserCircle />&nbsp;Profile</div>
        </div>
      )}

      {/* Search Bar */}
      <div style={styles.searchBarContainer}>
        <div style={styles.searchIcon}><FaSearch /></div>
        <input
          type="text"
          placeholder="Search blogs..."
          style={styles.searchBar}
        />
      </div>

      {/* Blog Cards */}
      <div style={styles.cardContainer}>
        {currentBlogs.map((blog) => (
          <div key={blog.id} style={styles.card}>
            <img src={blog.image} alt="Blog" style={styles.blogImage} />
            <div style={styles.blogContent}>
              <h3 style={styles.blogTitle}>{blog.title}</h3>
              <p style={styles.blogDescription}>{blog.description}</p>
              
              {/* Box at the bottom for Upvote, Bookmark, and AI Summarizer */}
              <div style={styles.cardFooter}>
                {/* Left - Upvote and Bookmark */}
                <div style={styles.actionBox}>
                  <div
                    onClick={() => toggleUpvote(blog.id)}
                    style={{
                      ...styles.iconBox,
                      backgroundColor: blog.upvoted ? "#ccc" : "transparent", // Gray if upvoted
                    }}
                  >
                    <FaArrowUp style={styles.icon} />
                  </div>
                  <div
                    onClick={() => toggleSave(blog.id)}
                    style={{
                      ...styles.iconBox,
                      backgroundColor: blog.saved ? "#ccc" : "transparent", // Gray if saved
                    }}
                  >
                    <FaBookmark style={styles.icon} />
                  </div>
                </div>

                {/* Right - AI Summarizer */}
                <div style={styles.aiSummarizer}>
                  <FaBolt style={styles.icon} />
                  <span style={styles.aiSummarizerText}>AI Summarizer</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={styles.pageButton}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={styles.pageCounter}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          style={styles.pageButton}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Categories Modal */}
      {showCategories && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeaderContainer}>
              <h2 style={styles.modalHeader}>Select a Company</h2>
              <FaTimes style={styles.closeIcon} onClick={() => setShowCategories(false)} />
            </div>
            <div style={styles.companyList}>
              {Object.keys(alphabetizedCompanies).map((letter) => (
                <div key={letter}>
                  <h3>{letter}</h3>
                  <ul style={styles.companyItems}>
                    {alphabetizedCompanies[letter].map((company) => (
                      <li key={company}>{company}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the components
const styles = {
  container: {
    fontFamily: '"Poppins", sans-serif',
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  navbar: {
    width: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.08)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.05)", // Optional for a more defined bottom edge
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  websiteName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
  },
  navIcon: {
    fontSize: "18px",
    color: "#333",
    marginLeft: "20px",
    cursor: "pointer",
  },
  desktopNav: {
    display: "flex",
  },
  hamburger: {
    fontSize: "24px",
    display: "none",
    cursor: "pointer",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
    width: "80%",
  },
  searchIcon: {
    fontSize: "20px",
    marginRight: "10px",
  },
  searchBar: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "30px",
    border: "1px solid #ddd",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
    outline: "none",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    width: "80%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    textAlign: "center",
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
  },
  blogContent: {
    padding: "10px",
  },
  blogTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },
  blogDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },
  icons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  icon: {
    fontSize: "20px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    gap: "20px",
  },
  pageButton: {
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 15px",
    cursor: "pointer",
    outline: "none",
  },
  pageCounter: {
    fontSize: "16px",
    color: "#333",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw", 
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, 
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "90%", 
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    borderBottom: "1px solid #ddd", // Add a bottom border for separation
    paddingBottom: "10px",
  },
  modalHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0, // Remove default margins for better alignment
  },
  closeIcon: {
    fontSize: "24px",
    cursor: "pointer",
    color: "#333",
  },
  companyList: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // Two columns to better display companies
    gap: "10px",
    marginTop: "10px", // Add some space above the list
  },
  companyItems: {
    listStyle: "none",
    padding: 0,
  },
  mobileMenu: {
    position: "absolute",
    top: "60px",
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    zIndex: 1000,
  },
  mobileMenuItem: {
    fontSize: "18px",
    padding: "10px 0",
    cursor: "pointer",
    width: "100%",
  },
  mobileMenuClose: {
    alignSelf: "flex-end",
    fontSize: "24px",
    cursor: "pointer",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    padding: "5px 0",
  },
  actionBox: {
    display: "flex",
    gap: "10px",
  },
  iconBox: {
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50px",
    cursor: "pointer",
  },
  aiSummarizer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    color: "#333",
  },
  aiSummarizerText: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  icon: {
    fontSize: "18px",
    cursor: "pointer",
  },

};

export default Dashboard;
