'use client'

import React, { useState, useEffect } from 'react';
import { HomeIcon, ListIcon, FlameIcon, BuildingIcon, UserIcon, ArrowUpIcon, BookmarkIcon, SearchIcon, XIcon, ZapIcon, FilterIcon, PlusIcon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const companies = [
  "Amazon", "Apple", "Adobe", "Microsoft", "Meta", "Netflix", "Google", "Tesla",
  "Intel", "IBM", "Zoom", "Yahoo", "Xiaomi", "Qualcomm", "Oracle", "Nike",
  "Spotify", "Uber", "Visa", "Walmart"
];

const initialBlogs = [
  {
    id: 1,
    image: "https://via.placeholder.com/300x200",
    title: "How to Create a Stunning UI in 2024",
    description:
      "Learn the latest trends in UI design to make your apps stand out.",
    upvotes: 150,
    upvoted: false,
    saved: false,
    category: "Design",
    readTime: "5 min read",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300x200",
    title: "The Power of Minimalism in Design",
    description: "Why less is more in today's digital age.",
    upvotes: 120,
    upvoted: false,
    saved: false,
    category: "Design",
    readTime: "4 min read",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x200",
    title: "Top 10 JavaScript Frameworks for Modern Web Development",
    description:
      "Explore the best JavaScript frameworks for building fast and responsive web applications.",
    upvotes: 200,
    upvoted: false,
    saved: false,
    category: "Technology",
    readTime: "8 min read",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/300x200",
    title: "Understanding CSS Grid and Flexbox",
    description:
      "A deep dive into CSS Grid and Flexbox for responsive layouts.",
    upvotes: 180,
    upvoted: true,
    saved: false,
    category: "Technology",
    readTime: "6 min read",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/300x200",
    title: "React Hooks: A Complete Guide for Beginners",
    description:
      "Learn everything you need to know about React hooks to start building powerful components.",
    upvotes: 250,
    upvoted: false,
    saved: true,
    category: "Technology",
    readTime: "10 min read",
  },
  {
    id: 6,
    image: "https://via.placeholder.com/300x200",
    title: "Web Development Trends to Watch in 2024",
    description:
      "Stay ahead of the curve with the latest web development trends and technologies.",
    upvotes: 190,
    upvoted: false,
    saved: true,
    category: "Technology",
    readTime: "7 min read",
  },
  {
    id: 7,
    image: "https://via.placeholder.com/300x200",
    title: "Building a Scalable Backend with Node.js and Express",
    description:
      "Learn how to build a powerful and scalable backend using Node.js and Express.",
    upvotes: 160,
    upvoted: true,
    saved: false,
    category: "Technology",
    readTime: "9 min read",
  },
  {
    id: 8,
    image: "https://via.placeholder.com/300x200",
    title: "SEO Best Practices for 2024",
    description:
      "Optimize your website and content to rank higher on search engines.",
    upvotes: 140,
    upvoted: true,
    saved: true,
    category: "Marketing",
    readTime: "6 min read",
  },
];

const categories = ["All", "Technology", "Design", "Marketing", "Business", "Lifestyle"];

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showCompanies, setShowCompanies] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSection, setActiveSection] = useState('Home');
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showRemoveBookmarkModal, setShowRemoveBookmarkModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [bookmarkLists, setBookmarkLists] = useState(['Favorites', 'Read Later']);
  const [newListName, setNewListName] = useState('');

  const blogsPerPage = 8;
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const filteredBlogs = blogs.filter(blog => 
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     blog.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || blog.category === selectedCategory)
  );
  const currentBlogs = activeSection === 'Trending' 
    ? filteredBlogs.sort((a, b) => b.upvotes - a.upvotes).slice(0, 8)
    : filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleUpvote = (blogId) => {
    setBlogs(blogs.map(blog =>
      blog.id === blogId ? { ...blog, upvotes: blog.upvotes + (blog.upvoted ? -1 : 1), upvoted: !blog.upvoted } : blog
    ));
  };

  const toggleSave = (blogId) => {
    const blog = blogs.find(blog => blog.id === blogId);
    if (blog.saved) {
      setSelectedBlogId(blogId);
      setShowRemoveBookmarkModal(true);
    } else {
      setSelectedBlogId(blogId);
      setShowBookmarkModal(true);
    }
  };

  const handleBookmark = (listName) => {
    setBlogs(blogs.map(blog =>
      blog.id === selectedBlogId ? { ...blog, saved: true } : blog
    ));
    setShowBookmarkModal(false);
    // Here you would typically save this information to a backend
    console.log(`Blog ${selectedBlogId} saved to ${listName}`);
  };

  const createNewList = () => {
    if (newListName.trim() !== '') {
      setBookmarkLists([...bookmarkLists, newListName.trim()]);
      handleBookmark(newListName.trim());
      setNewListName('');
    }
  };

  const removeBookmark = () => {
    setBlogs(blogs.map(blog =>
      blog.id === selectedBlogId ? { ...blog, saved: false } : blog
    ));
    setShowRemoveBookmarkModal(false);
    toast.success('Bookmark removed successfully');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="bottom-center" />
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">BlogSpace</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <NavItem icon={<HomeIcon className="h-5 w-5" />} text="Home" active={activeSection === 'Home'} onClick={() => setActiveSection('Home')} />
              <NavItem icon={<ListIcon className="h-5 w-5" />} text="List" active={activeSection === 'List'} onClick={() => setActiveSection('List')} />
              <NavItem icon={<FlameIcon className="h-5 w-5" />} text="Trending" active={activeSection === 'Trending'} onClick={() => setActiveSection('Trending')} />
              <NavItem
                icon={<BuildingIcon className="h-5 w-5" />}
                text="Companies"
                active={activeSection === 'Companies'}
                onClick={() => {
                  setShowCompanies(true);
                  setActiveSection('Companies');
                }}
              />
              <NavItem icon={<UserIcon className="h-5 w-5" />} text="Profile" active={activeSection === 'Profile'} onClick={() => setActiveSection('Profile')} />
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {mobileMenuOpen ? (
                  <XIcon className="block h-6 w-6" />
                ) : (
                  <ListIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavItem icon={<HomeIcon className="h-5 w-5" />} text="Home" mobile active={activeSection === 'Home'} onClick={() => { setActiveSection('Home'); setMobileMenuOpen(false); }} />
            <NavItem icon={<ListIcon className="h-5 w-5" />} text="List" mobile active={activeSection === 'List'} onClick={() => { setActiveSection('List'); setMobileMenuOpen(false); }} />
            <NavItem icon={<FlameIcon className="h-5 w-5" />} text="Trending" mobile active={activeSection === 'Trending'} onClick={() => { setActiveSection('Trending'); setMobileMenuOpen(false); }} />
            <NavItem
              icon={<BuildingIcon className="h-5 w-5" />}
              text="Companies"
              mobile
              active={activeSection === 'Companies'}
              onClick={() => {
                setShowCompanies(true);
                setActiveSection('Companies');
                setMobileMenuOpen(false);
              }}
            />
            <NavItem icon={<UserIcon className="h-5 w-5" />} text="Profile" mobile active={activeSection === 'Profile'} onClick={() => { setActiveSection('Profile'); setMobileMenuOpen(false); }} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search and filter */}
        <div className="max-w-3xl mx-auto mb-6 px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
          {currentBlogs.map((blog) => (
            <div key={blog.id} className="w-full">
              <BlogCard
                blog={blog}
                toggleUpvote={toggleUpvote}
                toggleSave={toggleSave}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {activeSection !== 'Trending' && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed'    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Companies modal */}
      {showCompanies && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Select a Company
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {companies.map((company) => (
                        <button
                          key={company}
                          onClick={() => {
                            // Here you can add logic to filter blogs by company
                            setShowCompanies(false);
                          }}
                          className="text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowCompanies(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark modal */}
      {showBookmarkModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Save to List
                    </h3>
                    <div className="mt-4 space-y-2">
                      {bookmarkLists.map((list) => (
                        <button
                          key={list}
                          onClick={() => handleBookmark(list)}
                          className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                        >
                          {list}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Create new list"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={createNewList}
                        className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create New List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowBookmarkModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Bookmark modal */}
      {showRemoveBookmarkModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Remove Bookmark
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this blog from your bookmarks?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={removeBookmark}
                >
                  Yes, Remove
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRemoveBookmarkModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, text, onClick, mobile, active }) => (
  <a
    href="#"
    className={`${
      mobile
        ? 'block px-3 py-2 rounded-md text-base font-medium'
        : 'px-3 py-2 rounded-md text-sm font-medium'
    } ${
      active
        ? 'bg-purple-100 text-purple-900'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }`}
    onClick={onClick}
  >
    <span className="flex items-center">
      {React.cloneElement(icon, { className: `${icon.props.className} ${active ? 'text-purple-600' : ''}` })}
      <span className={`ml-2 ${active ? 'text-purple-900' : ''}`}>{text}</span>
    </span>
  </a>
);

const BlogCard = ({ blog, toggleUpvote, toggleSave }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 h-full flex flex-col">
    <img className="h-48 w-full object-cover" src={blog.image} alt={blog.title} />
    <div className="p-4 flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
          {blog.category}
        </span>
        <span className="text-xs text-gray-500">{blog.readTime}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-grow">{blog.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => toggleUpvote(blog.id)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              blog.upvoted ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
            }`}
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span>{blog.upvotes}</span>
          </button>
          <button
            onClick={() => toggleSave(blog.id)}
            className={`p-1 rounded-full ${
              blog.saved ? 'bg-yellow-100  text-yellow-600' : 'bg-gray-200 text-gray-600'
            }`}
          >
            <BookmarkIcon className="h-4 w-4" />
          </button>
        </div>
        <button className="flex items-center text-sm text-indigo-600 hover:text-indigo-700">
          <ZapIcon className="h-4 w-4 mr-1" />
          AI Summary
        </button>
      </div>
    </div>
  </div>
)