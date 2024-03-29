import React, { useState } from "react";
import axios from "../../Axios/axios.js";
import moment from "moment";
import "./task.css";
import { useContext } from "react";
import TaskContext from "../../context/TaskContext";
import { Modal, Button, Input, Space } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TokenContext from "../../context/TokenContext";
import { useNavigate } from 'react-router-dom';
const { confirm } = Modal;
function Task({ task, id }) {
const nav = useNavigate()

  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this task?",
      icon: <DeleteIcon style={{ fontSize: 24, color: "#ff4d4f" }} />,
      onOk() {
        handleRemove();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleRemove = async () => {
    try {
      const res = await axios.delete(`/task/removeTask/${task._id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }

    dispatch({
      type: "REMOVE_TASK",
      id: task._id,
    });
  };

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `/task/updateTask/${task._id}`,
        {
          title: editedTitle,
          description: editedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
  
      console.log(res.data);
  
      // Update the task in local state
      dispatch({
        type: "UPDATE_TASK",
        id: task._id,
        title: editedTitle,
        description: editedDescription,
      });
  
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleCancelEdit = () => {
    setModalVisible(false);
  };

  const handleMarkDone = async () => {
    try {
      const res = await axios.put(`/task/markDone/${task._id}`,null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
  
      console.log(res.data);
  
      // Update the task in local state
      dispatch({
        type: "MARK_DONE",
        id: task._id,
      });
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3">
      <div className="mark-done">
        <input
          type="checkbox"
          className="checkbox"
          onChange={handleMarkDone}
          checked={task.completed}
        />
      </div>
      <div className="task-info text-slate-900 text-sm w-10/12">
        <h4 className="task-title text-lg capitalize">{task.title}</h4>
        <p className="task-description">{task.description}</p>
        <div className="italic opacity-60">
          {task?.createdAt ? (
            <p>{moment(task.createdAt).fromNow()}</p>
          ) : (
            <p>just now</p>
          )}
        </div>
      </div>
      <Space size="middle">
        <DeleteIcon
          style={{ fontSize: 30, cursor: "pointer" }}
          onClick={showDeleteConfirm}
          className="action-btn bg-red-500 rounded-full border-2 shadow-2xl border-white p-1"
        />
        <EditIcon
          style={{ fontSize: 30, cursor: "pointer" }}
          onClick={handleEdit}
          className="action-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
        />
      </Space>

      {/* Modal for Editing */}
      <Modal
      
        title="Update Todo"
        visible={isModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit} className="bg-blue-600 text-black">
            update
          </Button>,
        ]}
      >
        <label htmlFor="">Title</label>
        <Input
          className="mb-5 rounded shadow"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <label htmlFor="">Description</label>

        <Input.TextArea
          className="rounded shadow"

          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          rows={3}
        />
      </Modal>
    </div>
  );
}

export default Task;
