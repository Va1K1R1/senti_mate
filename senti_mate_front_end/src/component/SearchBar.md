# SearchBar Component

The SearchBar component provides a flexible and accessible search input for filtering content throughout the application.

## Features

- Debounced search input to reduce unnecessary API calls
- Clear button to easily reset the search
- Submit button for explicit search triggering
- Focus state with visual feedback
- Fully accessible with ARIA attributes
- Responsive design
- Dark mode support
- SVG icons for search and clear actions

## Usage

### Basic Usage

```jsx
import SearchBar from '../component/SearchBar';

const MyComponent = () => {
  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Filter your data based on searchTerm
  };
  
  return (
    <div>
      <h2>Search Products</h2>
      <SearchBar 
        placeholder="제품 검색..." 
        onSearch={handleSearch} 
      />
      {/* Your filtered content here */}
    </div>
  );
};
```

### Props

The SearchBar component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | string | "검색어를 입력하세요" | Placeholder text for the search input |
| `onSearch` | function | - | Function to call when search is performed |
| `initialValue` | string | "" | Initial value for the search input |
| `debounceTime` | number | 300 | Time in milliseconds to debounce search input |
| `showClearButton` | boolean | true | Whether to show the clear button |
| `className` | string | "" | Additional CSS class names |

## Examples

### With Initial Value

```jsx
<SearchBar 
  placeholder="사용자 검색..." 
  onSearch={handleSearch} 
  initialValue="John"
/>
```

### With Custom Debounce Time

```jsx
// Longer debounce time (500ms) for more expensive operations
<SearchBar 
  placeholder="제품 검색..." 
  onSearch={handleSearch} 
  debounceTime={500}
/>

// Shorter debounce time (100ms) for more responsive filtering
<SearchBar 
  placeholder="빠른 필터링..." 
  onSearch={handleSearch} 
  debounceTime={100}
/>
```

### Without Clear Button

```jsx
<SearchBar 
  placeholder="검색..." 
  onSearch={handleSearch} 
  showClearButton={false}
/>
```

### With Custom Styling

```jsx
<SearchBar 
  placeholder="검색..." 
  onSearch={handleSearch} 
  className="custom-search-bar"
/>
```

## Integration with Data Filtering

Here's an example of how to use the SearchBar component to filter a list of items:

```jsx
import React, { useState } from 'react';
import SearchBar from '../component/SearchBar';

const FilterableList = ({ items }) => {
  const [filteredItems, setFilteredItems] = useState(items);
  
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };
  
  return (
    <div>
      <SearchBar 
        placeholder="항목 검색..." 
        onSearch={handleSearch} 
      />
      
      <ul className="item-list">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))
        ) : (
          <li className="no-results">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};
```

## Accessibility

The SearchBar component includes the following accessibility features:

- Proper semantic HTML with `<form>` and `role="search"`
- Labeled input with `aria-label`
- SVG icons marked as `aria-hidden="true"`
- Clear button with descriptive `aria-label`
- Submit button with descriptive `aria-label`
- Keyboard navigation support
- Focus management
- Visible focus indicators