import React, { useState } from "react";
import axios from "../../Axios/axios.js";
import moment from "moment";
import "./task.css";
import { useContext } from "react";
import TaskContext from "../../context/TaskContext";
import { Modal, Button, Input, TextArea } from "antd"; // Import Ant Design components
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TokenContext from "../../context/TokenContext";

const { confirm } = Modal;

function Task({ task, id }) {
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
    // Perform the save edit logic, e.g., make a PUT request to update the task
    // ...

    // After saving the edit, close the modal
    setModalVisible(false);
  };

  const handleCancelEdit = () => {
    // Cancel the edit, close the modal
    setModalVisible(false);
  };

  const handleMarkDone = () => {
    dispatch({
      type: "MARK_DONE",
      id,
    });
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
        <div className=" italic opacity-60">
          {task?.createdAt ? (
            <p>{moment(task.createdAt).fromNow()}</p>
          ) : (
            <p>just now</p>
          )}
        </div>
      </div>
      <div className="action-buttons text-sm text-white d-flex ">
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
      </div>

      {/* Modal for Editing */}
      <Modal
        title="Edit Task"
        visible={isModalVisible}
        onOk={handleSaveEdit}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveEdit}>
            Save
          </Button>,
        ]}
      >
        <Input
        className="mb-5"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <Input.TextArea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          rows={3}
        />
      </Modal>
    </div>
  );
}

export default Task;
