import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchBar.css';

/**
 * SearchBar component for filtering content
 * 
 * @param {string} placeholder - Placeholder text for the search input
 * @param {function} onSearch - Callback function when search is performed
 * @param {number} debounceTime - Time in milliseconds to wait before triggering search after typing
 * @param {string} initialValue - Initial search value
 * @param {boolean} showClearButton - Whether to show the clear button
 * @param {boolean} autoFocus - Whether to auto-focus the search input
 * @param {string} className - Additional CSS class names
 * @param {boolean} expandable - Whether the search bar should expand on focus
 * @param {Array} searchHistory - Array of recent search terms to show as suggestions
 * @param {function} onSearchHistoryItemClick - Callback when a search history item is clicked
 * @param {function} onClearSearchHistory - Callback to clear search history
 */
const SearchBar = ({
  placeholder = '검색어를 입력하세요',
  onSearch,
  debounceTime = 300,
  initialValue = '',
  showClearButton = true,
  autoFocus = false,
  className = '',
  expandable = false,
  searchHistory = [],
  onSearchHistoryItemClick,
  onClearSearchHistory
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Debounce search to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (onSearch) {
        onSearch(term);
      }
    }, debounceTime),
    [onSearch, debounceTime]
  );
  
  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    inputRef.current?.blur();
  };
  
  // Handle clear button click
  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };
  
  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    if (searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleBlur = (e) => {
    // Don't hide suggestions if clicking inside the suggestions container
    if (suggestionsRef.current && suggestionsRef.current.contains(e.relatedTarget)) {
      return;
    }
    setIsFocused(false);
    setShowSuggestions(false);
  };
  
  // Handle search history item click
  const handleHistoryItemClick = (term) => {
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
    setShowSuggestions(false);
    if (onSearchHistoryItemClick) {
      onSearchHistoryItemClick(term);
    }
  };
  
  // Handle clear search history
  const handleClearHistory = (e) => {
    e.stopPropagation();
    if (onClearSearchHistory) {
      onClearSearchHistory();
    }
    setShowSuggestions(false);
  };
  
  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Update search term when initialValue changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);
  
  // Close suggestions on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target) && 
        inputRef.current && 
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div 
      className={`
        SearchBar 
        ${className} 
        ${isFocused ? 'SearchBar_focused' : ''} 
        ${expandable ? 'SearchBar_expandable' : ''}
      `}
    >
      <form onSubmit={handleSubmit} className="SearchBar_form">
        <div className="SearchBar_inputContainer">
          <span className="SearchBar_icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/>
            </svg>
          </span>
          
          <input
            ref={inputRef}
            type="text"
            className="SearchBar_input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={placeholder}
          />
          
          {showClearButton && searchTerm && (
            <button 
              type="button"
              className="SearchBar_clearButton"
              onClick={handleClear}
              aria-label="검색어 지우기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
              </svg>
            </button>
          )}
          
          <button 
            type="submit" 
            className="SearchBar_submitButton"
            aria-label="검색"
          >
            검색
          </button>
        </div>
      </form>
      
      {/* Search history suggestions */}
      {showSuggestions && searchHistory.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="SearchBar_suggestions"
          role="listbox"
          aria-label="검색 기록"
        >
          <div className="SearchBar_suggestionsHeader">
            <span>최근 검색어</span>
            <button 
              className="SearchBar_clearHistoryButton"
              onClick={handleClearHistory}
              aria-label="검색 기록 지우기"
            >
              모두 지우기
            </button>
          </div>
          
          <ul className="SearchBar_suggestionsList">
            {searchHistory.map((term, index) => (
              <li 
                key={`${term}-${index}`}
                className="SearchBar_suggestionItem"
                role="option"
                onClick={() => handleHistoryItemClick(term)}
              >
                <span className="SearchBar_historyIcon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12h2c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8C9.25 4 6.824 5.387 5.385 7.5H8v2H2v-6h2V6c1.824-2.43 4.729-4 8-4zm1 5v4.585l3.243 3.243-1.415 1.415L11 12.413V7h2z"/>
                  </svg>
                </span>
                {term}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchBar;