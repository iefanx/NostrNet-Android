import React, { useState, useEffect } from 'react';
import './Note.css';

// db.js
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('NoteDB', 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      const noteStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
      noteStore.createIndex('title', 'title', { unique: false });
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
};


const NoteTakingApp = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteContent, setSelectedNoteContent] = useState('');
  

  const openModal = (content) => {
    setSelectedNoteContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedNoteContent('');
    setModalVisible(false);
  };


  useEffect(() => {
    openDatabase()
      .then(db => {
        const transaction = db.transaction(['notes'], 'readonly');
        const noteStore = transaction.objectStore('notes');
        const getAllNotes = noteStore.getAll();

        getAllNotes.onsuccess = event => {
          setNotes(event.target.result);
        };
      })
      .catch(error => {
        console.error('Error opening database:', error);
      });
  }, []);

  useEffect(() => {
    const filteredNotes = notes.filter(
      note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredNotes);
  }, [searchQuery, notes]);

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const saveNote = () => {
  if (noteTitle.trim() && noteContent.trim()) {
    openDatabase()
      .then(db => {
        const transaction = db.transaction(['notes'], 'readwrite');
        const noteStore = transaction.objectStore('notes');

        const note = { title: noteTitle, content: noteContent };

        if (editingNoteId) {
          // Editing an existing note
          note.id = editingNoteId; // Ensure the edited note retains its ID
          const putRequest = noteStore.put(note); // Use put() to update existing note

          putRequest.onsuccess = () => {
            const updatedNotes = notes.map(existingNote =>
              existingNote.id === editingNoteId ? { ...note } : existingNote
            );
            setNotes(updatedNotes);
            clearInputs();
            setEditingNoteId(null); // Reset editing state
            alert('Note edited successfully.');
          };
        } else {
          // Adding a new note
          const addRequest = noteStore.add(note);

          addRequest.onsuccess = () => {
            setNotes([...notes, { ...note, id: addRequest.result }]);
            clearInputs();
            alert('Note saved successfully.');
          };
        }
      })
      .catch(error => {
        console.error('Error saving note:', error);
      });
  } else {
    alert('Please enter both a title and content for the note.');
  }
};


  const downloadNotes = () => {
  const dataToDownload = JSON.stringify(searchResults);
  const blob = new Blob([dataToDownload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'notes.json';
  a.click();

  URL.revokeObjectURL(url);
};

const restoreNotes = async (file) => {
    try {
      const text = await file.text();
      const parsedData = JSON.parse(text);

      if (Array.isArray(parsedData)) {
        openDatabase()
          .then(db => {
            const transaction = db.transaction(['notes'], 'readwrite');
            const noteStore = transaction.objectStore('notes');

            const existingNotesRequest = noteStore.getAll();

            existingNotesRequest.onsuccess = () => {
              const existingNotes = existingNotesRequest.result;
              const updatedNotes = [];

              parsedData.forEach(newNote => {
                const existingNoteIndex = existingNotes.findIndex(note => note.id === newNote.id);

                if (existingNoteIndex !== -1) {
                  const resolvedNote = { ...existingNotes[existingNoteIndex], ...newNote };
                  updatedNotes.push(resolvedNote);
                  existingNotes.splice(existingNoteIndex, 1);
                } else {
                  updatedNotes.push(newNote);
                }
              });

              updatedNotes.push(...existingNotes);

              const clearRequest = noteStore.clear();

              clearRequest.onsuccess = () => {
                const addRequests = updatedNotes.map(note => {
                  return noteStore.add(note);
                });

                Promise.all(addRequests).then(() => {
                  setNotes(updatedNotes);
                  setSearchResults(updatedNotes);
                  alert('Data restored and saved to IndexedDB successfully.');
                });
              };
            };
          })
          .catch(error => {
            console.error('Error opening database:', error);
          });
      } else {
        throw new Error('Invalid data format.');
      }
    } catch (error) {
      console.error('Error restoring data:', error);
      alert('Error restoring data. Please make sure the data is in valid JSON format.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      restoreNotes(file);
    }
  };



  const editNote = (noteId) => {
  const noteToEdit = notes.find(note => note.id === noteId);

  if (noteToEdit) {
    setNoteTitle(noteToEdit.title);
    setNoteContent(noteToEdit.content);
    setEditingNoteId(noteId); // Set the ID of the note being edited
  } else {
    console.error('Note not found for editing.');
  }
};

  const deleteNote = (noteId) => {
  if (window.confirm('Are you sure you want to delete this note?')) {
    openDatabase()
      .then(db => {
        const transaction = db.transaction(['notes'], 'readwrite');
        const noteStore = transaction.objectStore('notes');

        const deleteRequest = noteStore.delete(noteId);

        deleteRequest.onsuccess = () => {
          const updatedNotes = notes.filter(note => note.id !== noteId);
          setNotes(updatedNotes);
          setSearchResults(updatedNotes); // Update search results as well
          
        };

        deleteRequest.onerror = event => {
          console.error('Error deleting note:', event.target.error);
        };
      })
      .catch(error => {
        console.error('Error opening database:', error);
      });
  }
};


  const clearInputs = () => {
    setNoteTitle('');
    setNoteContent('');
  };

   return (
    <div className="min-h-full flex flex-col bg-[#18181a] items-center">
      <div className="w-screen rounded-lg p-4 bg-[#18181a] text-white">
        <h1 className="text-lg text-center font-bold mb-4">Quick Notes (beta)</h1>
        <div className="mb-4">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Enter note title"
            className="w-full p-2 border rounded focus:outline-none text-xs font-bold focus:border-blue-500 shadow-lg bg-[#252528] text-white border-none"
          />
        </div>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter note content"
          className="w-full p-2 h-32 border text-xs font-bold rounded focus:outline-none focus:border-blue-500 shadow-lg bg-[#252528] text-white border-none"
        />
        <div className="flex justify-center items-center mt-4">
          <div>
            <button onClick={saveNote} className="px-2 py-1 rounded-md shadow-lg font-bold text-sm  text-black bg-gray-300 ">
              Save Note
            </button>
          </div>
        </div>


        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search notes..."
          className="w-full p-1 mt-4 border shadow-lg rounded focus:outline-none text-xs font-bold focus:border-blue-500 bg-[#252528] text-white border-none"
        />
        <div className="flex space-x-1">
            <button onClick={downloadNotes} className="px-1 pt-3 bg-transparent font-extrabold rounded-md text-xs text-gray-300  ">
              Download
            </button>
            <input
              type="file"

              onChange={handleFileUpload}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="px-1 pt-3  rounded-md text-xs text-gray-300 font-extrabold   cursor-pointer">
              Restore
            </label>
          </div>

       <ul id="notesList" className="mt-4 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {searchResults
          .sort((a, b) => b.id - a.id) 
          .map((note) => (
          <li key={note.id} className="bg-[#252528] px-2 py-2 text-left rounded-lg shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-100 text-xs font-semibold mb-1">{note.title}</h3>
                  {/* Display the first 15 characters of the content */}
                  <p className="text-gray-300 text-xs font-semibold mb-2">
                    {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
                    
                  </p>
                </div>
              <div className="mt-2 flex justify-end space-x-4">
                <button onClick={() => deleteNote(note.id)} className="text-red-400 font-semibold text-sm">
                  Delete
                </button>
                <button onClick={() => editNote(note.id)} className="text-blue-400 font-semibold text-sm">
                  Edit
                </button>
                
                <button onClick={() => openModal(note.content)} className="text-blue-400 text-xs font-semibold ml-1  cursor-pointer focus:outline-none">
                      View
                    </button>
              </div>
            </li>
          ))}
      </ul>
      {modalVisible && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-[#18181a]  p-4 text-left rounded-lg shadow-lg max-w-full">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Note Content</h3>
                <p className="text-gray-300 font-semibold">{selectedNoteContent}</p>
              </div>
              <button onClick={closeModal} className=" flex justify-end text-blue-300 font-bold right-0">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default NoteTakingApp;
