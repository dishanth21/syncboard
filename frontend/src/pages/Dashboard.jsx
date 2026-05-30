import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { connectSocket, disconnectSocket } from "../services/socket";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const navigate = useNavigate();
  
  // Board and Column State
  const [boards, setBoards] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [connected, setConnected] = useState(false);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");

  // Form States
  const [boardName, setBoardName] = useState("");
  const [columnName, setColumnName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [priority, setPriority] = useState("HIGH");
  const [taskColumn, setTaskColumn] = useState("");

  // Modal and Loading States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingBoard, setEditingBoard] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Confirmation Dialog States
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadBoards();
    connectSocket(() => {
      setConnected(true);
      loadColumns();
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  async function loadBoards() {
    try {
      setLoading(true);
      const response = await api.get("/boards");
      setBoards(response.data);
      if (response.data.length > 0 && !selectedBoard) {
        setSelectedBoard(response.data[0].id);
      }
      await loadColumns();
    } catch (error) {
      showToast("Failed to load boards", "error");
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadColumns() {
    try {
      const response = await api.get("/columns");
      setColumns(response.data);
      if (response.data.length > 0 && !taskColumn) {
        setTaskColumn(response.data[0].id);
      }
    } catch (error) {
      showToast("Failed to load columns", "error");
    }
  }

  async function createBoard() {
    if (!boardName.trim()) {
      showToast("Board name is required", "warning");
      return;
    }

    try {
      setSaving(true);
      await api.post("/boards", {
        name: boardName,
        description: "Created From UI"
      });
      setBoardName("");
      setShowBoardModal(false);
      showToast("Board created successfully", "success");
      await loadBoards();
    } catch (error) {
      showToast("Failed to create board", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateBoard() {
    if (!editingBoard || !boardName.trim()) {
      showToast("Board name is required", "warning");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/boards/${editingBoard.id}`, {
        name: boardName,
        description: editingBoard.description
      });
      setShowBoardModal(false);
      setEditingBoard(null);
      setBoardName("");
      showToast("Board updated successfully", "success");
      await loadBoards();
    } catch (error) {
      showToast("Failed to update board", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBoard(boardId) {
    try {
      setSaving(true);
      await api.delete(`/boards/${boardId}`);
      setConfirmDialog(null);
      if (selectedBoard === boardId) {
        setSelectedBoard("");
      }
      showToast("Board deleted successfully", "success");
      await loadBoards();
    } catch (error) {
      showToast("Failed to delete board", "error");
    } finally {
      setSaving(false);
    }
  }

  async function createColumn() {
    if (!columnName.trim()) {
      showToast("Column name is required", "warning");
      return;
    }

    try {
      setSaving(true);
      await api.post("/columns", {
        name: columnName,
        board: { id: Number(selectedBoard) }
      });
      setColumnName("");
      setShowColumnModal(false);
      showToast("Column created successfully", "success");
      await loadColumns();
    } catch (error) {
      showToast("Failed to create column", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateColumn() {
    if (!editingColumn || !columnName.trim()) {
      showToast("Column name is required", "warning");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/columns/${editingColumn.id}`, {
        name: columnName
      });
      setShowColumnModal(false);
      setEditingColumn(null);
      setColumnName("");
      showToast("Column updated successfully", "success");
      await loadColumns();
    } catch (error) {
      showToast("Failed to update column", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteColumn(columnId) {
    try {
      setSaving(true);
      await api.delete(`/columns/${columnId}`);
      setConfirmDialog(null);
      showToast("Column deleted successfully", "success");
      await loadColumns();
    } catch (error) {
      showToast("Failed to delete column", "error");
    } finally {
      setSaving(false);
    }
  }

  async function createTask() {
    if (!taskTitle.trim()) {
      showToast("Task title is required", "warning");
      return;
    }

    try {
      setSaving(true);
      await api.post("/tasks", {
        title: taskTitle,
        description: taskDesc,
        priority,
        column: { id: Number(taskColumn) }
      });
      setTaskTitle("");
      setTaskDesc("");
      setPriority("HIGH");
      setShowTaskModal(false);
      showToast("Task created successfully", "success");
      await loadColumns();
    } catch (error) {
      showToast("Failed to create task", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateTask() {
    if (!editingTask || !taskTitle.trim()) {
      showToast("Task title is required", "warning");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/tasks/${editingTask.id}`, {
        title: taskTitle,
        description: taskDesc,
        priority
      });
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskTitle("");
      setTaskDesc("");
      showToast("Task updated successfully", "success");
      await loadColumns();
    } catch (error) {
      showToast("Failed to update task", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTask(taskId) {
    try {
      setSaving(true);
      await api.delete(`/tasks/${taskId}`);
      setConfirmDialog(null);
      showToast("Task deleted successfully", "success");
      await loadColumns();
    } catch (error) {
      showToast("Failed to delete task", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    try {
      await api.put(`/tasks/${result.draggableId}/move/${result.destination.droppableId}`);
      await loadColumns();
      showToast("Task moved successfully", "success");
    } catch (error) {
      showToast("Failed to move task", "error");
    }
  }

  function openEditTaskModal(task) {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setPriority(task.priority);
    setShowTaskModal(true);
  }

  function openEditBoardModal(board) {
    setEditingBoard(board);
    setBoardName(board.name);
    setShowBoardModal(true);
  }

  function openEditColumnModal(column) {
    setEditingColumn(column);
    setColumnName(column.name);
    setShowColumnModal(true);
  }

  function closeAllModals() {
    setShowTaskModal(false);
    setShowBoardModal(false);
    setShowColumnModal(false);
    setEditingTask(null);
    setEditingBoard(null);
    setEditingColumn(null);
    setTaskTitle("");
    setTaskDesc("");
    setBoardName("");
    setColumnName("");
    setPriority("HIGH");
  }

  function showToast(message, type) {
    setToast({ message, type });
  }

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  function getFilteredTasks(tasks) {
    return (tasks || []).filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                           task.description.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }

  const totalTasks = columns.reduce((sum, col) => sum + (col.tasks?.length || 0), 0);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h1>SyncBoard</h1>
        
        <div style={statusStyle}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: connected ? '#10b981' : '#ef4444',
            display: 'inline-block',
            marginRight: '8px'
          }}></div>
          Realtime: {connected ? '🟢 Connected' : '🔴 Offline'}
        </div>

        <hr style={hrStyle} />

        {/* Search */}
        <input
          placeholder="Search Tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        {/* Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        {/* Analytics */}
        <h3>Analytics</h3>
        <Card title="Boards" value={boards.length} />
        <Card title="Tasks" value={totalTasks} />

        <hr style={hrStyle} />

        {/* Board Section */}
        <h3>Board Management</h3>
        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select a board...</option>
          {boards.map(board => (
            <option key={board.id} value={board.id}>
              {board.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setBoardName("");
            setEditingBoard(null);
            setShowBoardModal(true);
          }}
          style={buttonStyle}
        >
          + New Board
        </button>

        {selectedBoard && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
            <button
              onClick={() => {
                const board = boards.find(b => b.id === selectedBoard);
                openEditBoardModal(board);
              }}
              style={{ ...smallButtonStyle, background: '#3b82f6' }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setConfirmDialog({
                  title: "Delete Board?",
                  message: "This will delete the board and all its columns and tasks. This action cannot be undone.",
                  onConfirm: () => deleteBoard(selectedBoard),
                  loading: saving
                });
              }}
              style={{ ...smallButtonStyle, background: '#ef4444' }}
            >
              Delete
            </button>
          </div>
        )}

        <hr style={hrStyle} />

        {/* Column Section */}
        <h3>Column Management</h3>
        <button
          onClick={() => {
            setColumnName("");
            setEditingColumn(null);
            setShowColumnModal(true);
          }}
          style={buttonStyle}
        >
          + New Column
        </button>

        <hr style={hrStyle} />

        {/* Task Section */}
        <h3>Task Management</h3>
        <input
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          style={inputStyle}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option>HIGH</option>
          <option>MEDIUM</option>
          <option>LOW</option>
        </select>

        <select
          value={taskColumn}
          onChange={(e) => setTaskColumn(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select column...</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setEditingTask(null);
            setTaskTitle("");
            setTaskDesc("");
            setPriority("HIGH");
            setShowTaskModal(true);
          }}
          style={buttonStyle}
        >
          + New Task
        </button>

        <hr style={hrStyle} />

        {/* User Actions */}
        <button
          onClick={() => navigate("/profile")}
          style={{ ...buttonStyle, background: '#6366f1' }}
        >
          👤 My Profile
        </button>

        <button
          onClick={logout}
          style={{ ...buttonStyle, background: '#dc2626' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={boardsContainerStyle}>
            {columns.length === 0 ? (
              <div style={emptyStateStyle}>
                <p>No columns yet. Create your first column to get started!</p>
              </div>
            ) : (
              columns.map(column => (
                <Droppable key={column.id} droppableId={String(column.id)}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        ...columnStyle,
                        background: snapshot.isDraggingOver ? '#374151' : '#1e293b'
                      }}
                    >
                      <div style={columnHeaderStyle}>
                        <h2>{column.name}</h2>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => openEditColumnModal(column)}
                            style={columnActionButtonStyle}
                            title="Edit column"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDialog({
                                title: "Delete Column?",
                                message: `Delete "${column.name}" and all its tasks?`,
                                onConfirm: () => deleteColumn(column.id),
                                loading: saving
                              });
                            }}
                            style={{ ...columnActionButtonStyle, color: '#ef4444' }}
                            title="Delete column"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {getFilteredTasks(column.tasks).length === 0 ? (
                        <div style={emptyColumnStyle}>
                          <p>No tasks</p>
                        </div>
                      ) : (
                        getFilteredTasks(column.tasks).map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...taskCardStyle,
                                  background: snapshot.isDragging ? '#4b5563' : '#334155',
                                  ...provided.draggableProps.style
                                }}
                              >
                                <h4 style={taskTitleStyle}>{task.title}</h4>
                                <p style={taskDescStyle}>{task.description}</p>
                                <small style={taskPriorityStyle}>{task.priority}</small>
                                <div style={taskActionStyle}>
                                  <button
                                    onClick={() => openEditTaskModal(task)}
                                    style={taskActionButtonStyle}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setConfirmDialog({
                                        title: "Delete Task?",
                                        message: `Delete "${task.title}"?`,
                                        onConfirm: () => deleteTask(task.id),
                                        loading: saving
                                      });
                                    }}
                                    style={{ ...taskActionButtonStyle, color: '#ef4444' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))
            )}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showTaskModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
        onClose={closeAllModals}
        onConfirm={editingTask ? updateTask : createTask}
        confirmText={editingTask ? "Update" : "Create"}
        loading={saving}
      >
        <div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Task Title *</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title"
              style={formInputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Enter task description"
              style={{ ...formInputStyle, minHeight: '100px' }}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={formInputStyle}
            >
              <option>HIGH</option>
              <option>MEDIUM</option>
              <option>LOW</option>
            </select>
          </div>

          {!editingTask && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Column</label>
              <select
                value={taskColumn}
                onChange={(e) => setTaskColumn(e.target.value)}
                style={formInputStyle}
              >
                <option value="">Select column</option>
                {columns.map(col => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showBoardModal}
        title={editingBoard ? "Edit Board" : "Create New Board"}
        onClose={closeAllModals}
        onConfirm={editingBoard ? updateBoard : createBoard}
        confirmText={editingBoard ? "Update" : "Create"}
        loading={saving}
      >
        <div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Board Name *</label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              style={formInputStyle}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showColumnModal}
        title={editingColumn ? "Edit Column" : "Create New Column"}
        onClose={closeAllModals}
        onConfirm={editingColumn ? updateColumn : createColumn}
        confirmText={editingColumn ? "Update" : "Create"}
        loading={saving}
      >
        <div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Column Name *</label>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Enter column name"
              style={formInputStyle}
            />
          </div>
        </div>
      </Modal>

      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
          loading={confirmDialog.loading}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={cardStyle}>
      <h4 style={{ margin: '0 0 10px 0' }}>{title}</h4>
      <h2 style={{ margin: 0, fontSize: '28px' }}>{value}</h2>
    </div>
  );
}

// Styles
const containerStyle = {
  display: 'flex',
  background: '#0f172a',
  color: 'white',
  minHeight: '100vh'
};

const sidebarStyle = {
  width: '320px',
  padding: '20px',
  background: '#111827',
  borderRight: '1px solid #1f2937',
  overflowY: 'auto',
  maxHeight: '100vh'
};

const statusStyle = {
  fontSize: '14px',
  marginBottom: '20px',
  color: '#d1d5db'
};

const hrStyle = {
  border: 'none',
  borderTop: '1px solid #374151',
  margin: '20px 0'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  borderRadius: '8px',
  background: '#1e293b',
  border: '1px solid #374151',
  color: 'white',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#2563eb',
  border: 'none',
  color: 'white',
  borderRadius: '8px',
  marginBottom: '10px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
};

const smallButtonStyle = {
  flex: 1,
  padding: '8px',
  background: '#3b82f6',
  border: 'none',
  color: 'white',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px'
};

const cardStyle = {
  background: '#1e293b',
  padding: '15px',
  marginBottom: '10px',
  borderRadius: '10px'
};

const mainStyle = {
  flex: 1,
  padding: '25px',
  overflowX: 'auto',
  overflowY: 'auto'
};

const boardsContainerStyle = {
  display: 'flex',
  gap: '20px',
  minWidth: 'min-content'
};

const columnStyle = {
  background: '#1e293b',
  padding: '20px',
  width: '350px',
  borderRadius: '15px',
  minHeight: '600px',
  transition: 'all 0.2s ease'
};

const columnHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  paddingBottom: '15px',
  borderBottom: '2px solid #374151'
};

const columnActionButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#9ca3af',
  cursor: 'pointer',
  fontSize: '18px',
  padding: '5px',
  transition: 'color 0.2s',
  ':hover': { color: 'white' }
};

const emptyColumnStyle = {
  color: '#9ca3af',
  textAlign: 'center',
  paddingTop: '40px',
  fontSize: '14px'
};

const taskCardStyle = {
  background: '#334155',
  padding: '15px',
  marginBottom: '15px',
  borderRadius: '12px',
  cursor: 'grab',
  transition: 'all 0.2s ease',
  ':hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  }
};

const taskTitleStyle = {
  margin: '0 0 8px 0',
  fontSize: '15px',
  fontWeight: '600'
};

const taskDescStyle = {
  margin: '0 0 10px 0',
  fontSize: '13px',
  color: '#d1d5db'
};

const taskPriorityStyle = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  background: '#1f2937',
  color: '#fbbf24'
};

const taskActionStyle = {
  display: 'flex',
  gap: '8px',
  marginTop: '12px'
};

const taskActionButtonStyle = {
  flex: 1,
  padding: '6px 10px',
  background: '#2563eb',
  border: 'none',
  color: 'white',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px'
};

const emptyStateStyle = {
  color: '#9ca3af',
  textAlign: 'center',
  padding: '60px 40px',
  fontSize: '16px'
};

const formGroupStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#9ca3af',
  fontWeight: '500'
};

const formInputStyle = {
  width: '100%',
  padding: '12px',
  background: '#111827',
  border: '1px solid #374151',
  color: 'white',
  borderRadius: '8px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

export default Dashboard;
