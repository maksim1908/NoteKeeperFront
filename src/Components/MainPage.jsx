import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MainPage.css';
import { FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
const MainPage = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [fullContentNote, setFullContentNote] = useState(null);
  const [fixedSize, setFixedSize] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', reminderTime: '' });
  const [groups, setGroups] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ title: '' });
  const navigate = useNavigate();

  // Функция для вывода ошибки с помощью Toast
  const handleError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Validation failed");
    }
  };

  const handleCreateGroup = () => {
    const token = localStorage.getItem('jwtToken');
    axios.post('http://localhost:8081/api/group', newGroup, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setGroups([...groups, response.data]);
        setIsCreatingGroup(false);
        setNewGroup({ title: '' });
      })
      .catch(handleError)
      setNewGroup({ title: '' });
  };


  const handleDeleteGroup = (groupId, event) => {
    event.stopPropagation();
    const token = localStorage.getItem('jwtToken');
    axios.delete(`http://localhost:8081/api/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setGroups(groups.filter(group => group.id !== groupId));
      fetchNotes();
    })
    .catch((error) => {
      console.error("Ошибка при удалении группы:", error);
    });
  };

  const fetchGroups = () => {
    const token = localStorage.getItem('jwtToken');
    axios.get('http://localhost:8081/api/group?size=10000', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const groupContent = response.data.content; // Извлекаем массив групп
      setGroups(groupContent);
    })
    .catch((error) => {
      console.error('Ошибка при загрузке групп:', error);
    });
  };
  const handleAllNotesClick = () => {
    fetchNotes();  // Загружаем все заметки
  };
  const handleGroupClick = (groupId) => {
    const token = localStorage.getItem('jwtToken');
    axios.get(`http://localhost:8081/api/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setNotes(response.data.notes); // Устанавливаем заметки для выбранной группы
    })
    .catch((error) => {
      console.error("Ошибка при загрузке заметок для группы:", error);
    });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchNotes = (search = '') => {
    const token = localStorage.getItem('jwtToken');
    axios.get('http://localhost:8081/api/note/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        title: search,
      },
    })
    .then((response) => {
      if (Array.isArray(response.data)) {
        setNotes(response.data);
      } else {
        console.error("Ошибка: ожидаемый формат данных (массив), но получен:", response.data);
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке заметок!", error);
    });
  };


  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios.get('http://localhost:8081/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
      },
      })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных пользователя:", error);
      });
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      fetchNotes();
    } else {
      const timer = setTimeout(() => {
        fetchNotes(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleEditClick = (note, event) => {
    event.stopPropagation();
    setEditingNote(note);
  };

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    const token = localStorage.getItem('jwtToken');
    axios.delete(`http://localhost:8081/api/note/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setNotes(notes.filter(note => note.id !== id));
    })
    .catch((error) => {
      console.error("Ошибка при удалении заметки:", error);
    });
  };

  const handleViewFullContent = (note, event) => {
    event.stopPropagation();
    setFullContentNote(note);
    setFixedSize(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    //window.location.reload();
    navigate("/login");
  };

  const handleCreateNote = () => {
    const token = localStorage.getItem('jwtToken');
    axios.post('http://localhost:8081/api/note', newNote, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        fetchNotes();
        setIsCreatingNote(false);
        setNewNote({ title: '', content: '', reminderTime: '' });
      })
      .catch(handleError);
  };

  return (
    <div>
      {/* Хедер */}
      <header className="header">
        <div className="username">{username ? `Hello, ${username}` : 'Loading user...'}</div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      {/* Поиск */}
            
      <div className="search-container">
        <div className="button-container">
        <button className="create-note-button" onClick={() => setIsCreatingNote(true)}>
        Create Note
    </button>
    <button className="create-group-button" onClick={() => setIsCreatingGroup(true)}>
          Create Group
        </button>
        </div>
    
    <div className="search-section">
        <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearchChange}
        />
        {searchQuery && (
            <button className="clear-search" onClick={handleClearSearch}>
                <FaTimes />
            </button>
        )}
        {!searchQuery && <FaSearch className="search-icon" />}
    </div>
</div>

<div className="groups-container">
  <div className="group-item-title">
      Groups: 
  </div>
  <div className="group-item-all" onClick={handleAllNotesClick}>
      All
  </div>
  {groups.map((group) => (
  <div key={group.id} className="group-item" onClick={() => handleGroupClick(group.id)}>
    {group.title}
    <button
      className="delete-group-button"
      onClick={(e) => handleDeleteGroup(group.id, e)}
      title="Delete Group"
    >
      <FaTrash />
    </button>
  </div>
))}
</div>
      {/* Кнопка "Создать заметку" */}
      

      {/* Модальное окно для создания заметки */}
      {isCreatingNote && (
        <div className="modal open">
          <div className="modal-content">
            <h2>Create Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <input
              type="datetime-local"
              value={newNote.reminderTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => {
                const selectedTime = new Date(e.target.value);
                const now = new Date();
                if (selectedTime < now) {
                  // Если выбрано время в прошлом, сбрасываем значение
                  toast.error("You cannot select a past time!");
                  e.target.value = newNote.reminderTime; // Сохраняем текущее значение
                } else {
                  setNewNote({ ...newNote, reminderTime: e.target.value });
                }
              }}
            />
            <button onClick={handleCreateNote}>Save</button>
            <button onClick={() => setIsCreatingNote(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Модальное окно для создания группы */}
      {isCreatingGroup && (
        <div className="modal open">
          <div className="modal-content">
            <h2>Create Group</h2>
            <input
              type="text"
              placeholder="Group Title"
              value={newGroup.title}
              onChange={(e) => setNewGroup({ ...newGroup, title: e.target.value })}
            />
            <button onClick={handleCreateGroup}>Save</button>
            <button onClick={() => setIsCreatingGroup(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/* Контейнер заметок */}
      <div className="notes-container">
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="note-card" onClick={(e) => handleViewFullContent(note, e)}>
              <h3>{note.title}</h3>
              <div className="content-wrapper">
                <p>{note.content}</p>
              </div>
              <div className="note-actions">
                <button onClick={(e) => handleEditClick(note, e)}><FaEdit /> Edit</button>
                <button onClick={(e) => handleDeleteClick(note.id, e)}><FaTrash /> Delete</button>
              </div>

              {note.createdAt && <div className="note-date"><strong>Created At:</strong> {new Date(note.createdAt).toLocaleString()}</div>}
              {note.updatedAt && <div className="note-date"><strong>Updated At:</strong> {new Date(note.updatedAt).toLocaleString()}</div>}
              {note.reminderTime && <div className="note-date"><strong>Reminder Time:</strong> {new Date(note.reminderTime).toLocaleString()}</div>}
            </div>
          ))
        ) : (
          <p>No notes found</p>
        )}
    </div>
        {/* Модальное окно с полным контентом */}
        {fullContentNote && (
          <div className={`modal ${fullContentNote ? 'open' : ''}`}>
            <div className="modal-content">
              <h2>{fullContentNote.title}</h2>
              <textarea
                value={fullContentNote.content}
                readOnly
                className={fixedSize ? 'fixed-textarea' : ''}
              />
              <button onClick={() => setFullContentNote(null)}>Close</button>
            </div>
          </div>
        )}
        
        {/* Модальное окно для редактирования */}
        {editingNote && (
          <div className={`modal ${editingNote ? 'open' : ''}`}>
            <div className="modal-content">
              <h2>Edit Note</h2>
              <input
                type="text"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              />
              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              />
              <p>Reminder Time:</p>
              <input
  type="datetime-local"
  value={editingNote.reminderTime ? editingNote.reminderTime : ''}
  min={new Date().toISOString().slice(0, 16)} // Устанавливаем минимальное значение времени
  onChange={(e) => {
    const selectedTime = new Date(e.target.value);
    const now = new Date();
    if (selectedTime < now) {
      // Если выбранное время меньше текущего времени, сбрасываем значение и показываем ошибку
      toast.error("You cannot select a past time!");
      e.target.value = editingNote.reminderTime; // Возвращаем предыдущее значение
    } else {
      setEditingNote({ ...editingNote, reminderTime: e.target.value });
    }
  }}
/>
              {/* Выпадающий список для выбора группы */}
      <p>Group:</p>
      <select
        value={editingNote.groupId || 'null'}
        onChange={(e) => setEditingNote({ ...editingNote, groupId: e.target.value === 'null' ? null : e.target.value })}
      >
        <option value="null">No Group</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.title}
          </option>
        ))}
      </select>

              <button
                onClick={() => {
                  const token = localStorage.getItem('jwtToken');
                  axios.put(`http://localhost:8081/api/note/${editingNote.id}`, editingNote, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then(() => {
                      setNotes(notes.map(note => note.id === editingNote.id ? editingNote : note));
                      setEditingNote(null);
                      fetchNotes();
                    })
                    .catch(handleError);
                }}
              >
                Save Changes
              </button>
              <button onClick={() => setEditingNote(null)}>Close</button>
            </div>
          </div>
        )}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar 
          newestOnTop 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          closeButton={<button className="toast-close-button">X</button>}
        />
      </div>
  );
};

export default MainPage;
