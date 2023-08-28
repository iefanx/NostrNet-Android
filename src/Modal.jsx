import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ url, title, setUrl, setTitle, handleSaveClick, handleClose }) => {
  const inputRef = useRef(null);
  const [urlWarning, setUrlWarning] = useState('');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);

    if (!value.startsWith('http')) {
      setUrlWarning('URL must start with "http:// or https://"');
    } else {
      setUrlWarning('');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#18181a] bg-opacity-50 flex items-start justify-center z-50">
      <div className="bg-[#18181a]  rounded shadow-lg p-6 w-96 mt-40">
        <h2 className="text-xs font-semibold mb-4">Add new WebApps of your choice. You can also
         discover the latest Nostr services by clicking the 'App Store' button and
          copying/pasting the link here.</h2>
        <input
          type="url"
          className=" input-style2 w-full py-2 px-4 text-gray-500 rounded border border-gray-300 mb-4"
          placeholder="https://"
          value={url}
          onChange={handleUrlChange}
          ref={inputRef}
        />
        {urlWarning && <p className="text-red-500 mb-2">{urlWarning}</p>}
        <input
          type="text"
          className="input-style2 w-full py-2 px-4 text-gray-700 rounded border border-gray-300 mb-4"
          placeholder="Website Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-between">
          <a href="https://nostrapp.link/" rel="noopener noreferrer">
            <button className="px-4 py-1 text-sm rounded bg-gray-700 font-bold text-gray-200">
              App Store
            </button>
          </a>
          <div>
            <button
              className="py-1.5 px-4 font-bold bg-[#303479] text-sm text-white rounded mr-2"
              onClick={handleSaveClick}
              disabled={!url.startsWith('http')}
            >
              Save
            </button>
            <button className="py-1.5 px-4 font-bold text-sm bg-gray-700 text-gray-100 rounded" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

Modal.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  handleSaveClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Modal;
