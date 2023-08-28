import React, { useState } from 'react';


const SearchForm = ({ value, onChange, onSubmit, placeholder }) => (
  <form onSubmit={onSubmit} className="flex items-center rounded p-2">
    <input
      type="text"
      name="q"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="input-style font-semibold shadow-lg p-2 outline-none"
    />
  </form>
);

const DuckDuckGoSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContent, setModalContent] = useState(null); // 

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchUrl = `https://nostr.band/?q=${encodeURIComponent(searchQuery)}`;
    setModalContent(<iframe src={searchUrl} title="Search Results" className="w-full rounded-xl   px-1 h-full" />);
  };


  const closeModal = () => {
    setModalContent(null);
  };

  

    return (
      <div className="flex items-center justify-center">
        <SearchForm
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearchSubmit}
          placeholder="Search on Nostr"
        />

 

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-3  items-center pt-7 justify-center bg-opacity-50 z-10">
          <div className=" h-full  w-full  rounded-lg">
            <button onClick={closeModal}  className=" absolute top-0  font-mono font-semibold rounded-full text-black bg-gray-300 right-2">
              <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default DuckDuckGoSearchBar;
