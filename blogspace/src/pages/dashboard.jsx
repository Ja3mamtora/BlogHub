import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { debounce, throttle } from 'lodash'
import { HomeIcon, ListIcon, FlameIcon, BuildingIcon, ArrowUpIcon, BookmarkIcon, SearchIcon, XIcon, ZapIcon, FilterIcon, PlusIcon, SunIcon, MoonIcon, LogOutIcon, TrashIcon } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'

const API_BASE_URL = 'https://blogspace-dun.vercel.app/api/v1/user'
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

const categories = ['All', 'AI', 'API', 'Algorithm', 'Android', 'Big Data', 'Blockchain', 'CI/CD', 'Cloud Computing', 'Cyber Security', 'Data Engineering', 'Data Science', 'Database', 'DevOps', 'Engineering', 'Feature', 'FinTech', 'Gen_AI', 'Hardware', 'HealthTech', 'IT', 'IOS', 'IoT', 'Java', 'LLM', 'Machine Learning', 'Management', 'Marketing', 'Migration', 'NLP', 'NoSQL', 'Optimization', 'Productivity', 'Programming', 'Redis', 'SRE', 'SaaS', 'Software Development', 'Sustainability', 'Technology', 'UI/UX', 'Web Development']

const companies = [
  "Amazon", "Apple", "Adobe", "Microsoft", "Meta", "Netflix", "Google", "Tesla",
  "Intel", "IBM", "Zoom", "Yahoo", "Xiaomi", "Qualcomm", "Oracle", "Nike",
  "Spotify", "Uber", "Visa", "Walmart"
]

export default function Dashboard() {
  const [blogs, setBlogs] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeSection, setActiveSection] = useState('Home')
  const [bookmarkLists, setBookmarkLists] = useState([])
  const [theme, setTheme] = useState('light')
  const [showMyListsModal, setShowMyListsModal] = useState(false)
  const [showCompanies, setShowCompanies] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [selectedBlogId, setSelectedBlogId] = useState(null)
  const [newListName, setNewListName] = useState('')
  const [showDeleteListConfirmation, setShowDeleteListConfirmation] = useState(false)
  const [listToDelete, setListToDelete] = useState(null)
  const [showDeleteBlogConfirmation, setShowDeleteBlogConfirmation] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const fetchBlogs = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/blogs', {
        params: { page, limit: 8, category: selectedCategory !== 'All' ? selectedCategory : undefined }
      })
      setBlogs(response.data.data.data.blogs)
      console.log(response.data.data.data.blogs)
      setTotalPages(response.data.data.data.totalPages)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to fetch blogs')
      setBlogs([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const debouncedSearch = useMemo(
    () => debounce(async (term) => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get('/search', {
          params: { query: term, page: 1, limit: 8 }
        })
        setBlogs(response.data.data)
        setTotalPages(response.data.totalPages)
        setCurrentPage(1)
      } catch (error) {
        console.error('Error searching blogs:', error)
        toast.error('Failed to search blogs')
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    debouncedSearch(e.target.value)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const throttledUpvote = useMemo(
    () => throttle(async (blogId, isUpvoted) => {
      try {
        await axiosInstance.patch('/upvote', { blogId, isUpvoted })
      } catch (error) {
        console.error('Error upvoting blog:', error)
        toast.error('Failed to upvote blog')
        // Revert the optimistic update
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id === blogId 
              ? { ...blog, isUpvoted: !isUpvoted, upvote_count: isUpvoted ? blog.upvote_count - 1 : blog.upvote_count + 1 } 
              : blog
          )
        )
      }
    }, 2000),
    []
  )

  const handleUpvote = (blogId) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => {
        if (blog.id === blogId) {
          const newIsUpvoted = !blog.isUpvoted
          return {
            ...blog,
            isUpvoted: newIsUpvoted,
            upvote_count: newIsUpvoted ? blog.upvote_count + 1 : blog.upvote_count - 1
          }
        }
        return blog
      })
    )

    const updatedBlog = blogs.find(blog => blog.id === blogId)
    if (updatedBlog) {
      throttledUpvote(blogId, updatedBlog.isUpvoted)
    }
  }

  const handleAddToList = async (blogId, listName) => {
    try {
      await axiosInstance.patch('/addToList', { blogId, listName })
      toast.success(`Added to ${listName}`)
      fetchBlogs(currentPage)
    } catch (error) {
      console.error('Error adding to list:', error)
      toast.error('Failed to add to list')
    }
  }

  const handleCreateList = async () => {
    if (newListName.trim() !== '') {
      try {
        await axiosInstance.post('/createList', { listName: newListName.trim() })
        toast.success(`Created list: ${newListName.trim()}`)
        setNewListName('')
        fetchBookmarkLists()
      } catch (error) {
        console.error('Error creating list:', error)
        toast.error('Failed to create list')
      }
    }
  }

  const fetchBookmarkLists = async () => {
    try {
      const response = await axiosInstance.get('/bookmarkLists')
      setBookmarkLists(response.data)
    } catch (error) {
      console.error('Error fetching bookmark lists:', error)
      toast.error('Failed to fetch bookmark lists')
    }
  }

  useEffect(() => {
    fetchBookmarkLists()
  }, [])

  const handleDeleteList = (listName) => {
    setListToDelete(listName)
    setShowDeleteListConfirmation(true)
  }

  const confirmDeleteList = async () => {
    try {
      await axiosInstance.patch('/removeList', { listName: listToDelete })
      setBookmarkLists(bookmarkLists.filter(list => list.name !== listToDelete))
      setShowDeleteListConfirmation(false)
      setListToDelete(null)
      toast.success(`List "${listToDelete}" deleted successfully`)
    } catch (error) {
      console.error('Error deleting list:', error)
      toast.error('Failed to delete list')
    }
  }

  const handleDeleteBlog = (listName, blogId) => {
    setBlogToDelete({ listName, blogId })
    setShowDeleteBlogConfirmation(true)
  }

  const confirmDeleteBlog = async () => {
    try {
      await axiosInstance.patch('/removeFromList', { blogId: blogToDelete.blogId, listName: blogToDelete.listName })
      setShowDeleteBlogConfirmation(false)
      setBlogToDelete(null)
      toast.success('Blog removed from saved list')
      fetchBookmarkLists()
    } catch (error) {
      console.error('Error removing blog from list:', error)
      toast.error('Failed to remove blog from list')
    }
  }

  const handleCompanySelect = async (company) => {
    setSelectedCompany(company)
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/blogs/company', {
        params: { company, page: 1, limit: 8 }
      })
      setBlogs(response.data.data)
      setTotalPages(response.data.totalPages)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error fetching blogs by company:', error)
      toast.error('Failed to fetch blogs by company')
    } finally {
      setIsLoading(false)
      setShowCompanies(false)
    }
  }

  const handleAISummaryClick = () => {
    setShowComingSoon(true)
    setTimeout(() => setShowComingSoon(false), 2000)
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
  }, [])

  const toggleSave = (blogId) => {
    const blog = blogs.find(blog => blog.id === blogId)
    if (blog.isBookmarked) {
      setSelectedBlogId(blogId)
      setShowDeleteBlogConfirmation(true)
    } else {
      setSelectedBlogId(blogId)
      setShowBookmarkModal(true)
    }
  }

  const handleBookmark = async (listName) => {
    try {
      await axiosInstance.patch('/addToList', { blogId: selectedBlogId, listName })
      setBlogs(blogs.map(blog =>
        blog.id === selectedBlogId ? { ...blog, isBookmarked: true } : blog
      ))
      setShowBookmarkModal(false)
      toast.success(`Blog saved to ${listName}`)
    } catch (error) {
      console.error('Error bookmarking blog:', error)
      toast.error('Failed to bookmark blog')
    }
  }

  useEffect(() => {
    if (!isLoading && blogs.length === 0) {
      toast.error('Failed to load blogs. Please try again later.')
    }
  }, [isLoading, blogs])

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
              <NavItem icon={<ListIcon className="h-5 w-5" />} text="List" active={activeSection === 'List'} onClick={() => setShowMyListsModal(true)} theme={theme} />
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
                  toast.success('Signed out successfully')
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
                toast.success('Signed out successfully')
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
                  onChange={handleSearchChange}
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
          {(isLoading || blogs.length === 0) ? (
            // Skeleton loading screen
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow-lg rounded-lg h-96 animate-pulse`}>
                <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                handleUpvote={handleUpvote}
                toggleSave={() => toggleSave(blog.id)}
                theme={theme}
                handleAISummaryClick={handleAISummaryClick}
              />
            ))
          )}
        </div>

        {showComingSoon && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <p className="text-lg font-semibold">AI Summary Coming Soon!</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && activeSection !== 'Trending' && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <nav className={`relative z-0 inline-flex rounded-md shadow-sm -space-x-px ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} aria-label="Pagination">
              <button
                onClick={() => fetchBlogs(currentPage - 1)}
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
                onClick={() => fetchBlogs(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                  theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
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

      {/* Modals */}
      {/* Companies modal */}
      {showCompanies && (
        <div 
          className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4 sm:p-0" 
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true" 
          onClick={() => setShowCompanies(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>
          <div 
            className={`relative rounded-lg shadow-xl transform transition-all w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-4 sm:px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className="text-xl sm:text-2xl font-semibold" id="modal-title">
                Select a Company
              </h3>
              <button
                onClick={() => setShowCompanies(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {Object.entries(groupedCompanies).map(([letter, companies]) => (
                  <div key={letter} className="space-y-2">
                    <h4 className={`text-lg sm:text-xl font-bold sticky top-0 z-10 py-1 ${
                      theme === 'dark' 
                        ? 'text-purple-300 bg-gray-800' 
                        : 'text-purple-600 bg-white'
                    }`}>
                      {letter}
                    </h4>
                    <div className="space-y-1">
                      {companies.map((company) => (
                        <button
                          key={company}
                          onClick={() => handleCompanySelect(company)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between ${
                            selectedCompany === company
                              ? theme === 'dark'
                                ? 'bg-purple-700 text-white'
                                : 'bg-purple-100 text-purple-900'
                              : theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                          <span className="truncate">{company}</span>
                          {selectedCompany === company && (
                            <CheckIcon className="h-5 w-5 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
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
                        onClick={handleCreateList}
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
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => setShowMyListsModal(false)}>
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`inline-block align-middle rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-xl sm:w-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} onClick={(e) => e.stopPropagation()}>
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
                    <button
                      onClick={() => setShowMyListsModal(false)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                      } focus:outline-none`}
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
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
                        onClick={handleCreateList}
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
                                  }`}>{blog.reading_time} min read</p>
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
                  onClick={confirmDeleteBlog}
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

const BlogCard = ({ blog, handleUpvote, toggleSave, theme, handleAISummaryClick }) => (
  <div className={`${
    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  } overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 h-full flex flex-col relative`}>
    <img className="h-48 w-full object-cover" src={blog.image_url} alt={blog.title} />
    <div className="p-4 flex-grow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-600'
        }`}>
          {blog.topic}
        </span>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{blog.reading_time} min</span>
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h3>
      <p className={`text-sm mb-4 flex-grow ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{blog.description}</p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpvote(blog.id)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              blog.isUpvoted
                ? theme === 'dark'
                  ? 'bg-purple-900 text-purple-200'
                  : 'bg-purple-100 text-purple-600'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            } transition-colors duration-200`}
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span>{blog.upvote_count}</span>
          </button>
          <button
            onClick={() => toggleSave(blog.id)}
            className={`p-1 rounded-full ${
              blog.isBookmarked
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
        <button 
          onClick={handleAISummaryClick}
          className={`flex items-center text-sm ${
            theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          <ZapIcon className="h-4 w-4 mr-1" />
          AI Summary
        </button>
      </div>
    </div>
  </div>
)