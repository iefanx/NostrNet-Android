import React, { useState } from 'react';

const websiteLinks = [
  {
    id: 1,
    title: 'Backup',
    url: 'https://nostryfied.online/',
  },
  {
    id: 2,
    title: 'Share',
    url: ' https://www.sharedrop.io/',
  },
  
  // Add more links as needed
];

const ExtModel = ({ isOpen, onClose }) => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [activeIframes, setActiveIframes] = useState([]);

  const handleLinkClick = (url) => {
  if (!activeIframes.includes(url)) {
    setSelectedLink(url);
    setActiveIframes([url]); // Reset the active iframes to show only the clicked iframe
  }
};


  const handleCloseAll = () => {
    setSelectedLink(null);
    setActiveIframes([]);
    onClose(); // Close the modal
  };

   const handleIframeLoad = (url) => {
    setActiveIframes((prevActiveIframes) => [...prevActiveIframes, url]);

  };


  return (
    <div className={`ext-model ${isOpen ? 'open' : ''}`}>
      <div className="ext-model-content">
        <button className="close-button" onClick={onClose}>
          
          -
        </button>
        <button className="close-all-button p" onClick={handleCloseAll}>
            x
          </button>
        <div className="website-buttons pt-3">
          {websiteLinks.map((link) => (
            <button
              key={link.id}
              className="website-button"
              onClick={() => handleLinkClick(link.url)}
            >
              {link.title}
            </button>
          ))}
          
        </div>
        {selectedLink && (
          <div className="iframe-container2">
            <iframe
              src={selectedLink}
              frameBorder="0"
              scrolling="yes"
              className="embed-iframe2"
              title="Website Iframe"
              allow="clipboard-write"
              loading="lazy"
              onLoad={() => handleIframeLoad(selectedLink)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtModel;
