import React, { useState, useEffect, useMemo } from 'react'
import { HomeIcon, ListIcon, FlameIcon, BuildingIcon, ArrowUpIcon, BookmarkIcon, SearchIcon, XIcon, ZapIcon, FilterIcon, PlusIcon, SunIcon, MoonIcon, LogOutIcon, TrashIcon} from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

const companies = [
  "Amazon", "Apple", "Adobe", "Microsoft", "Meta", "Netflix", "Google", "Tesla",
  "Intel", "IBM", "Zoom", "Yahoo", "Xiaomi", "Qualcomm", "Oracle", "Nike",
  "Spotify", "Uber", "Visa", "Walmart"
]

const initialBlogs = [
  {
    id: 1,
    image: "https://via.placeholder.com/300x200",
    title: "How to Create a Stunning UI in 2024",
    description: "Learn the latest trends in UI design to make your apps stand out.",
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
    description: "Explore the best JavaScript frameworks for building fast and responsive web applications.",
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
    description: "A deep dive into CSS Grid and Flexbox for responsive layouts.",
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
    description: "Learn everything you need to know about React hooks to start building powerful components.",
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
    description: "Stay ahead of the curve with the latest web development trends and technologies.",
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
    description: "Learn how to build a powerful and scalable backend using Node.js and Express.",
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
    description: "Optimize your website and content to rank higher on search engines.",
    upvotes: 140,
    upvoted: true,
    saved: true,
    category: "Marketing",
    readTime: "6 min read",
  },
]

const initialBookmarkLists = [
  {
    name: 'Reading List',
    blogs: [
      { id: 1, title: 'Getting Started with React', date: '2024-01-15', readTime: '5 min read', tags: ['React', 'Frontend'] },
      { id: 2, title: 'Advanced JavaScript Concepts', date: '2024-01-16', readTime: '8 min read', tags: ['JavaScript'] },
      { id: 7, title: 'Understanding React Context API', date: '2024-02-10', readTime: '6 min read', tags: ['React'] },
      { id: 8, title: 'Intro to Progressive Web Apps', date: '2024-02-12', readTime: '9 min read', tags: ['PWA', 'Frontend'] },
      { id: 3, title: 'Understanding TypeScript', date: '2024-01-17', readTime: '6 min read', tags: ['TypeScript'] },
      { id: 4, title: 'CSS Grid Layout Guide', date: '2024-01-18', readTime: '4 min read', tags: ['CSS'] },
      { id: 5, title: 'Modern Web Development', date: '2024-01-19', readTime: '7 min read', tags: ['Web Dev'] },
      { id: 9, title: 'Using APIs Effectively', date: '2024-02-13', readTime: '5 min read', tags: ['API', 'Backend'] },
      { id: 10, title: 'Async JavaScript Deep Dive', date: '2024-02-15', readTime: '10 min read', tags: ['JavaScript', 'Async'] },
    ]
  },
  {
    name: 'Tech Articles',
    blogs: [
      { id: 3, title: 'Understanding TypeScript', date: '2024-01-17', readTime: '6 min read', tags: ['TypeScript'] },
      { id: 4, title: 'CSS Grid Layout Guide', date: '2024-01-18', readTime: '4 min read', tags: ['CSS'] },
      { id: 5, title: 'Modern Web Development', date: '2024-01-19', readTime: '7 min read', tags: ['Web Dev'] },
      { id: 9, title: 'Using APIs Effectively', date: '2024-02-13', readTime: '5 min read', tags: ['API', 'Backend'] },
      { id: 10, title: 'Async JavaScript Deep Dive', date: '2024-02-15', readTime: '10 min read', tags: ['JavaScript', 'Async'] },
    ]
  },
  {
    name: 'Favorites',
    blogs: [
      { id: 6, title: 'Node.js Best Practices', date: '2024-01-20', readTime: '10 min read', tags: ['Node.js', 'Backend'] },
      { id: 11, title: 'Microservices Architecture', date: '2024-02-18', readTime: '12 min read', tags: ['Microservices'] },
      { id: 12, title: 'Docker for Beginners', date: '2024-02-20', readTime: '8 min read', tags: ['Docker', 'DevOps'] },
    ]
  },
  {
    name: 'AI & ML',
    blogs: [
      { id: 13, title: 'Intro to Machine Learning', date: '2024-02-22', readTime: '15 min read', tags: ['Machine Learning'] },
      { id: 14, title: 'Neural Networks Basics', date: '2024-02-24', readTime: '14 min read', tags: ['Neural Networks', 'AI'] },
      { id: 15, title: 'Natural Language Processing', date: '2024-02-26', readTime: '18 min read', tags: ['NLP', 'AI'] },
    ]
  },
  {
    name: 'DevOps',
    blogs: [
      { id: 16, title: 'CI/CD Pipelines Explained', date: '2024-02-28', readTime: '7 min read', tags: ['DevOps', 'CI/CD'] },
      { id: 17, title: 'Kubernetes 101', date: '2024-03-01', readTime: '9 min read', tags: ['Kubernetes'] },
      { id: 18, title: 'Serverless Computing Guide', date: '2024-03-03', readTime: '11 min read', tags: ['Serverless', 'Cloud'] },
    ]
  },
  {
    name: 'Data Science',
    blogs: [
      { id: 19, title: 'Data Visualization with D3.js', date: '2024-03-05', readTime: '10 min read', tags: ['D3.js', 'Data Science'] },
      { id: 20, title: 'Statistical Analysis Basics', date: '2024-03-07', readTime: '12 min read', tags: ['Statistics', 'Data Science'] },
      { id: 21, title: 'Python for Data Science', date: '2024-03-09', readTime: '8 min read', tags: ['Python', 'Data Science'] },
    ]
  }
];

const categories = ['All','AI', 'API', 'Algorithm', 'Android', 'Big Data', 'Blockchain', 'CI/CD', 'Cloud Computing', 'Cyber Security', 'Data Engineering', 'Data Science', 'Database', 'DevOps', 'Engineering', 'Feature', 'FinTech', 'Gen_AI', 'Hardware', 'HealthTech', 'IT','IOS', 'IoT', 'Java', 'LLM', 'Machine Learning', 'Management', 'Marketing', 'Migration', 'NLP', 'NoSQL', 'Optimization', 'Productivity', 'Programming', 'Redis', 'SRE', 'SaaS', 'Software Development', 'Sustainability', 'Technology', 'UI/UX', 'Web Development']

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [blogs, setBlogs] = useState(initialBlogs)
  const [showCompanies, setShowCompanies] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeSection, setActiveSection] = useState('Home')
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [selectedBlogId, setSelectedBlogId] = useState(null)
  const [newListName, setNewListName] = useState('')
  const [theme, setTheme] = useState('light')
  const [showMyListsModal, setShowMyListsModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [bookmarkLists, setBookmarkLists] = useState(initialBookmarkLists)
  const [showDeleteListConfirmation, setShowDeleteListConfirmation] = useState(false)
  const [listToDelete, setListToDelete] = useState(null)
  const [showDeleteBlogConfirmation, setShowDeleteBlogConfirmation] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleDeleteList = (listName) => {
    setListToDelete(listName)
    setShowDeleteListConfirmation(true)
  }

  const confirmDeleteList = () => {
    setBookmarkLists(bookmarkLists.filter(list => list.name !== listToDelete))
    setShowDeleteListConfirmation(false)
    setListToDelete(null)
    toast.success(`List "${listToDelete}" deleted successfully`)
  }

  const handleDeleteBlog = (listName, blogId) => {
    setBlogToDelete({ listName, blogId })
    setShowDeleteBlogConfirmation(true)
  }

  const deleteBlog = () => {
    setBlogs(blogs.map(blog =>
      blog.id === selectedBlogId ? { ...blog, saved: false } : blog
    ))
    setShowDeleteBlogConfirmation(false)
    toast.success('Blog removed from saved list')
  }
  const groupedCompanies = useMemo(() => {
    return companies.sort().reduce((acc, company) => {
      const initial = company[0].toUpperCase()
      if (!acc[initial]) {
        acc[initial] = []
      }
      acc[initial].push(company)
      return acc
    }, {})
  }, [companies])

  const blogsPerPage = 8
  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const filteredBlogs = blogs.filter(blog => 
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     blog.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || blog.category === selectedCategory)
  )
  const currentBlogs = activeSection === 'Trending' 
    ? filteredBlogs.sort((a, b) => b.upvotes - a.upvotes).slice(0, 8)
    : filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog)
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const toggleUpvote = (blogId) => {
    setBlogs(blogs.map(blog =>
      blog.id === blogId ? { ...blog, upvotes: blog.upvotes + (blog.upvoted ? -1 : 1), upvoted: !blog.upvoted } : blog
    ))
  }

  const toggleSave = (blogId) => {
    const blog = blogs.find(blog => blog.id === blogId)
    if (blog.saved) {
      setSelectedBlogId(blogId)
      setShowDeleteBlogConfirmation(true)
    } else {
      setSelectedBlogId(blogId)
      setShowBookmarkModal(true)
    }
  }

  const handleBookmark = (listName) => {
    setBlogs(blogs.map(blog =>
      blog.id === selectedBlogId ? { ...blog, saved: true } : blog
    ))
    setShowBookmarkModal(false)
    toast.success(`Blog saved to ${listName}`)
  }

  const createNewList = () => {
    if (newListName.trim() !== '') {
      const newList = {
        name: newListName.trim(),
        blogs: []
      }
      setBookmarkLists([...bookmarkLists, newList])
      handleBookmark(newListName.trim())
      setNewListName('')
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Toaster position="bottom-center" />
      {/* Navbar */}
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">BlogSpace</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <NavItem icon={<HomeIcon className="h-5 w-5" />} text="Home" active={activeSection === 'Home'} onClick={() => setActiveSection('Home')} theme={theme} />
              <NavItem 
                icon={<ListIcon className="h-5 w-5" />} 
                text="List" 
                active={activeSection === 'List'} 
                onClick={() => {
                  setShowMyListsModal(true);
                }}
                theme={theme} 
              />
              <NavItem icon={<FlameIcon className="h-5 w-5" />} text="Trending" active={activeSection === 'Trending'} onClick={() => setActiveSection('Trending')} theme={theme} />
              <NavItem
                icon={<BuildingIcon className="h-5 w-5" />}
                text="Companies"
                active={activeSection === 'Companies'}
                onClick={() => {
                  setShowCompanies(true)
                  setActiveSection('Companies')
                }}
                theme={theme}
              />
              <button
                onClick={() => {
                  // Add logic for signing out
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LogOutIcon className="h-5 w-5 mr-2" />
                Sign Out
              </button>
              <button
                onClick={toggleTheme}
                className={`ml-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
              >
                {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
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
        <div className={`sm:hidden fixed top-16 left-0 right-0 z-40 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <NavItem icon={<HomeIcon className="h-5 w-5" />} text="Home" mobile active={activeSection === 'Home'} onClick={() => { setActiveSection('Home'); setMobileMenuOpen(false); }} theme={theme} />
            <NavItem icon={<ListIcon className="h-5 w-5" />} text="List" mobile active={activeSection === 'List'} onClick={() => { setShowMyListsModal(true); setMobileMenuOpen(false); }} theme={theme} />
            <NavItem icon={<FlameIcon className="h-5 w-5" />} text="Trending" mobile active={activeSection === 'Trending'} onClick={() => { setActiveSection('Trending'); setMobileMenuOpen(false); }} theme={theme} />
            <NavItem
              icon={<BuildingIcon className="h-5 w-5" />}
              text="Companies"
              mobile
              active={activeSection === 'Companies'}
              onClick={() => {
                setShowCompanies(true)
                setActiveSection('Companies')
                setMobileMenuOpen(false)
              }}
              theme={theme}
            />
            <NavItem 
              icon={<LogOutIcon className="h-5 w-5" />} 
              text="Sign Out" 
              mobile 
              onClick={() => {
                // Add logic for signing out
                setMobileMenuOpen(false);
              }} 
              theme={theme} 
            />
            <button
              onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        {/* Search and filter */}
        <div className="max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
        <div className={`bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-purple-900 to-indigo-900' 
            : 'from-purple-100 to-indigo-100'
        } rounded-xl shadow-lg p-3`}>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow group">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-10 py-3 border-2 ${
                  theme === 'dark' 
                    ? 'border-purple-500 bg-gray-800 text-white placeholder-purple-300' 
                    : 'border-purple-300 bg-white text-gray-900 placeholder-purple-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300`}
              />
              <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
              }`} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="relative sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-12 pr-10 py-3 border-2 ${
                  theme === 'dark' 
                    ? 'border-indigo-500 bg-gray-800 text-white' 
                    : 'border-indigo-300 bg-white text-gray-900'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer transition duration-300`}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <FilterIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 ${
                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
              } pointer-events-none`} />
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
          {currentBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              toggleUpvote={toggleUpvote}
              toggleSave={() => toggleSave(blog.id)}
              theme={theme}
            />
          ))}
        </div>

        {/* Pagination */}
        {activeSection !== 'Trending' && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <nav className={`relative z-0 inline-flex rounded-md shadow-sm -space-x-px ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} aria-label="Pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                  theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium ${
                  currentPage === 1 ? 'cursor-not-allowed' : ''
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  theme === 'dark'
                    ? 'border-gray-1000 bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                } text-sm font-medium ${
                  currentPage === totalPages ? 'cursor-not-allowed' : ''
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
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 py-6 sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className={`relative inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} id="modal-title">
                      Select a Company
                    </h3>
                    <div 
                      className="mt-2 max-h-[60vh] overflow-y-auto pr-2"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: theme === 'dark' ? '#4a5568 #2d3748' : '#cbd5e0 #edf2f7',
                      }}
                    >
                      {Object.entries(groupedCompanies).map(([letter, companies]) => (
                        <div key={letter} className="mb-4">
                          <h4 className={`text-2xl font-bold mb-2 sticky top-0 z-10 py-1 ${
                            theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-white'
                          }`}>
                            {letter}
                          </h4>
                          {companies.map((company) => (
                            <button
                              key={company}
                              onClick={() => setSelectedCompany(company)}
                              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                selectedCompany === company
                                  ? theme === 'dark'
                                    ? 'bg-purple-700 text-white'
                                    : 'bg-purple-100 text-purple-900'
                                  : theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                            >
                              {company}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => {
                    if (selectedCompany) {
                      toast.success(`Selected ${selectedCompany}`)
                    }
                    setShowCompanies(false)
                  }}
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
            <div className={`inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} id="modal-title">
                      Save to List
                    </h3>
                    <div className="mt-4 space-y-2">
                      {bookmarkLists.map((list) => (
                        <button
                          key={list.name}
                          onClick={() => handleBookmark(list.name)}
                          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                            theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200`}
                        >
                          {list.name}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Create new list"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <button
                        onClick={createNewList}
                        className={`mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                          theme === 'dark'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create New List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => setShowBookmarkModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Lists modal */}
      {showMyListsModal && (
       <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className={`inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className={`text-lg leading-6 font-medium mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} id="modal-title">
                    My Lists
                  </h3>
                  <div className="mb-4 flex flex-col sm:flex-row">
                    <input
                      type="text"
                      placeholder="Enter new list name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className={`flex-grow px-3 py-2 border rounded-md sm:rounded-r-none mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-purple-500 h-10 ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <button
                      onClick={createNewList}
                      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md sm:rounded-l-none shadow-sm text-sm font-medium h-10 ${
                        theme === 'dark'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create
                    </button>
                  </div>
                  <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {bookmarkLists.map((list) => (
                      <div key={list.name} className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className={`text-lg font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{list.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>{list.blogs.length} blogs</span>
                            <button
                              onClick={() => handleDeleteList(list.name)}
                              className={`p-1 rounded-full ${
                                theme === 'dark' ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              }`}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {list.blogs.map((blog) => (
                            <div key={blog.id} className={`p-2 rounded ${
                              theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                            } flex justify-between items-center`}>
                              <div>
                                <h5 className={`text-sm font-medium ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{blog.title}</h5>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>{blog.readTime}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteBlog(list.name, blog.id)}
                                className={`p-1 rounded-full ${
                                  theme === 'dark' ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <button
                type="button"
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                  theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm`}
                onClick={() => setShowMyListsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div> 
      )}

      {/* Delete List Confirmation Modal */}
      {showDeleteListConfirmation && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} id="modal-title">
                      Delete List
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Are you sure you want to delete the list "{listToDelete}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-red-600 text-wheat-500 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDeleteList}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => setShowDeleteListConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Blog Confirmation Modal */}
      {showDeleteBlogConfirmation && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} id="modal-title">
                      Remove Saved Blog
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Are you sure you want to remove this blog from your saved list?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 bg-red-600 text-wheat-500 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={deleteBlog}
                >
                  Remove
                </button>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={() => setShowDeleteBlogConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const NavItem = ({ icon, text, active, onClick, mobile, theme }) => (
  <button
    onClick={onClick}
    className={`${mobile ? 'flex w-full items-center' : 'inline-flex items-center'} px-3 py-2 rounded-md text-sm font-medium ${
      active
        ? theme === 'dark'
          ? 'bg-purple-900 text-white'
          : 'bg-purple-100 text-purple-900'
        : theme === 'dark'
        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    } transition-colors duration-200`}
  >
    {React.cloneElement(icon, { className: `${icon.props.className} ${mobile  ? 'mr-3' : 'mr-1.5'}` })}
    <span>{text}</span>
  </button>
)

const BlogCard = ({ blog, toggleUpvote, toggleSave, theme }) => (
  <div className={`${
    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  } overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 h-full flex flex-col`}>
    <img className="h-48 w-full object-cover" src={blog.image} alt={blog.title} />
    <div className="p-4 flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-600'
        }`}>
          {blog.category}
        </span>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{blog.readTime}</span>
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h3>
      <p className={`text-sm mb-4 flex-grow ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{blog.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => toggleUpvote(blog.id)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              blog.upvoted
                ? theme === 'dark'
                  ? 'bg-indigo-900 text-indigo-200'
                  : 'bg-indigo-100 text-indigo-600'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span>{blog.upvotes}</span>
          </button>
          <button
            onClick={() => toggleSave(blog.id)}
            className={`p-1 rounded-full ${
              blog.saved
                ? theme === 'dark'
                  ? 'bg-yellow-900 text-yellow-200'
                  : 'bg-yellow-100 text-yellow-600'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <BookmarkIcon className="h-4 w-4" />
          </button>
        </div>
        <button className={`flex items-center text-sm ${
          theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
        }`}>
          <ZapIcon className="h-4 w-4 mr-1" />
          AI Summary
        </button>
      </div>
    </div>
  </div>
)