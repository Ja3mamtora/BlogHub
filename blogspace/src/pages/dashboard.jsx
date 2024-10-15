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
  "Amazon",
  "Apple",
  "Adobe",
  "Microsoft",
  "Meta",
  "Netflix",
  "Google",
  "Tesla",
  "Intel",
  "IBM",
  "Zoom",
  "Yahoo",
  "Xiaomi",
  "Qualcomm",
  "Oracle",
  "Nike",
  "Spotify",
  "Uber",
  "Visa",
  "Walmart",
];

const initialBlogs = [
  {
    id: 1,
    image: "https://via.placeholder.com/100",
    title: "How to Create a Stunning UI in 2024",
    description:
      "Learn the latest trends in UI design to make your apps stand out.",
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
    description:
      "Explore the best JavaScript frameworks for building fast and responsive web applications.",
    upvoted: false,
    saved: false,
  },
  {
    id: 4,
    image: "https://via.placeholder.com/100",
    title: "Understanding CSS Grid and Flexbox",
    description:
      "A deep dive into CSS Grid and Flexbox for responsive layouts.",
    upvoted: true,
    saved: false,
  },
  {
    id: 5,
    image: "https://via.placeholder.com/100",
    title: "React Hooks: A Complete Guide for Beginners",
    description:
      "Learn everything you need to know about React hooks to start building powerful components.",
    upvoted: false,
    saved: true,
  },
  {
    id: 6,
    image: "https://via.placeholder.com/100",
    title: "Web Development Trends to Watch in 2024",
    description:
      "Stay ahead of the curve with the latest web development trends and technologies.",
    upvoted: false,
    saved: true,
  },
  {
    id: 7,
    image: "https://via.placeholder.com/100",
    title: "Building a Scalable Backend with Node.js and Express",
    description:
      "Learn how to build a powerful and scalable backend using Node.js and Express.",
    upvoted: true,
    saved: false,
  },
  {
    id: 8,
    image: "https://via.placeholder.com/100",
    title: "SEO Best Practices for 2024",
    description:
      "Optimize your website and content to rank higher on search engines.",
    upvoted: true,
    saved: true,
  },
  {
    id: 9,
    image: "https://via.placeholder.com/100",
    title: "Mastering Asynchronous JavaScript with Promises and Async/Await",
    description:
      "A comprehensive guide to handling asynchronous code in JavaScript.",
    upvoted: false,
    saved: false,
  },
  {
    id: 10,
    image: "https://via.placeholder.com/100",
    title: "Introduction to TypeScript for JavaScript Developers",
    description:
      "Learn how TypeScript enhances JavaScript development with static typing.",
    upvoted: false,
    saved: false,
  },
];

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const blogsPerPage = 16;
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const alphabetizedCompanies = companies.sort().reduce((acc, company) => {
    const firstLetter = company[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(company);
    return acc;
  }, {});

  const toggleUpvote = (blogId) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId ? { ...blog, upvoted: !blog.upvoted } : blog,
      ),
    );
  };

  const toggleSave = (blogId) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId ? { ...blog, saved: !blog.saved } : blog,
      ),
    );
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <span style={styles.logo}>BlogSpace</span>
        <div style={styles.desktopNav}>
          <NavItem icon={<FaList />} text="List" />
          <NavItem icon={<FaFire />} text="Trending" />
          <NavItem
            icon={<FaTh />}
            text="Categories"
            onClick={() => setShowCategories(!showCategories)}
          />
          <NavItem icon={<FaUserCircle />} text="Profile" />
        </div>
        <button
          style={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaList />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <NavItem icon={<FaList />} text="List" mobile />
          <NavItem icon={<FaFire />} text="Trending" mobile />
          <NavItem
            icon={<FaTh />}
            text="Categories"
            onClick={() => {
              setShowCategories(!showCategories);
              setMobileMenuOpen(false);
            }}
            mobile
          />
          <NavItem icon={<FaUserCircle />} text="Profile" mobile />
        </div>
      )}

      {/* Search Bar */}
      <div style={styles.searchBarContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search blogs..."
          style={styles.searchBar}
        />
      </div>

      {/* Blog Cards */}
      <div style={styles.blogGrid}>
        {currentBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            toggleUpvote={toggleUpvote}
            toggleSave={toggleSave}
          />
        ))}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === 1 ? styles.disabledButton : {}),
          }}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={styles.pageCounter}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === totalPages ? styles.disabledButton : {}),
          }}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Categories Modal */}
      {showCategories && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Select a Company</h2>
              <FaTimes
                style={styles.closeIcon}
                onClick={() => setShowCategories(false)}
              />
            </div>
            <div style={styles.companyGrid}>
              {Object.entries(alphabetizedCompanies).map(
                ([letter, companies]) => (
                  <div key={letter} style={styles.companySection}>
                    <h3 style={styles.companySectionTitle}>{letter}</h3>
                    <ul style={styles.companyList}>
                      {companies.map((company) => (
                        <li key={company} style={styles.companyItem}>
                          {company}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, text, onClick, mobile }) => (
  <div
    style={{ ...styles.navItem, ...(mobile ? styles.mobileNavItem : {}) }}
    onClick={onClick}
  >
    {icon}
    <span style={styles.navItemText}>{text}</span>
  </div>
);

const BlogCard = ({ blog, toggleUpvote, toggleSave }) => (
  <div style={styles.blogCard}>
    <img src={blog.image} alt="Blog" style={styles.blogImage} />
    <div style={styles.blogContent}>
      <h3 style={styles.blogTitle}>{blog.title}</h3>
      <p style={styles.blogDescription}>{blog.description}</p>
      <div style={styles.blogActions}>
        <div style={styles.blogActionButtons}>
          <IconButton
            icon={<FaArrowUp />}
            active={blog.upvoted}
            onClick={() => toggleUpvote(blog.id)}
          />
          <IconButton
            icon={<FaBookmark />}
            active={blog.saved}
            onClick={() => toggleSave(blog.id)}
          />
        </div>
        <div style={styles.aiSummarizer}>
          <FaBolt style={styles.aiIcon} />
          <span style={styles.aiText}>AI Summarizer</span>
        </div>
      </div>
    </div>
  </div>
);

const IconButton = ({ icon, active, onClick }) => (
  <button
    style={{ ...styles.iconButton, ...(active ? styles.activeIconButton : {}) }}
    onClick={onClick}
  >
    {icon}
  </button>
);

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
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
    marginBottom: "20px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  desktopNav: {
    display: "flex",
    alignItems: "center",
  },
  mobileMenuButton: {
    display: "none",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },
  mobileMenu: {
    position: "fixed",
    top: "60px",
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    marginLeft: "20px",
    cursor: "pointer",
  },
  mobileNavItem: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
  },
  navItemText: {
    marginLeft: "5px",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "20px",
    borderRadius: "50%",
  },
  searchIcon: {
    marginRight: "10px",
    color: "#666",
  },
  searchBar: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  blogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
  },
  blogCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  blogImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  blogContent: {
    padding: "15px",
  },
  blogTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  blogDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  },
  blogActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blogActionButtons: {
    display: "flex",
    gap: "10px",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "55%",
  },
  activeIconButton: {
    backgroundColor: "#ffffff",
  },
  aiSummarizer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  aiIcon: {
    marginRight: "5px",
  },
  aiText: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  pageButton: {
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    margin: "0 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  pageCounter: {
    fontSize: "16px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  closeIcon: {
    cursor: "pointer",
    fontSize: "24px",
  },
  companyGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  companySection: {
    marginBottom: "20px",
  },
  companySectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  companyList: {
    listStyle: "none",
    padding: 0,
  },
  companyItem: {
    padding: "5px 0",
    cursor: "pointer",
  },
  "@media (maxWidth: 768px)": {
    desktopNav: {
      display: "none",
    },
    mobileMenuButton: {
      display: "block",
    },
    blogGrid: {
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    },
    companyGrid: {
      gridTemplateColumns: "1fr",
    },
  },
};
