import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { CirclePicker } from "react-color";
import { css } from "glamor";
import { confirmAlert } from "react-confirm-alert";

import { Row, Col, Button, InputGroup, Input } from "reactstrap";

import "react-confirm-alert/src/react-confirm-alert.css";
import Widget from "../../components/Widget";
import s from "./Task.module.scss";

import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";
import EditFolderModal from "./EditFolderModal";

import useLocalStorage from "../../utils/useLocalStorage";
import {
  retrieveFolders,
  retrieveFolder,
  retrieveParentFolders,
  retrieveAllWithSharedUsers,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../../actions/folders";
import { updateTask, deleteTask } from "../../actions/tasks";

const themeColorList = ["rgb(91 71 92)", "#B8405E", "#546B68", "#2EB086", "#9145B6", "#5AA897", "#FB743E"];
const spanColorList = ["#D4B957", "#546B59", "#B8A4A3", "#6B546B", "#40857D", "#495D6B", "#6B623E"];
const today = new Date().toISOString().slice(0, 10);

export default function Task() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [themeColor, setThemeColor] = useLocalStorage("themeColor", themeColorList[0]);
  const [spanColor, setSpanColor] = useLocalStorage("spanColor", spanColorList[0]);

  const [folders, setFolders] = useState([]); // 최상위 폴더 리스트
  const [columns, setColumns] = useState([]); // 현재 선택된 폴더의 컬럼 리스트
  const [columnLastOrderNum, setColumnLastOrderNum] = useState(0); // 현재 선택된 폴더의 컬럼 리스트의 마지막 정렬 넘버

  const [currentFolder, setCurrentFolder] = useLocalStorage("currentFolder", "0"); // 현재 선택된 최상위 폴더

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false); // 테스크 생성 모달 오픈
  const [addColumnForm, setAddColumnForm] = useState([]); // 새로운 테스크를 추가할 컬럼 정보

  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false); // 테스크 수정 모달 오픈
  const [editTaskForm, setEditTaskForm] = useState([]); // 수정할 테스크 정보

  const [editFolderModalOpen, setEditFolderModalOpen] = useState(false); // 컬럼 수정 모달 오픈
  const [editFolderForm, setEditFolderForm] = useState([]); // 수정할 폴더(컬럼) 정보

  const [editSharedUserModalOpen, setEditSharedUserModalOpen] = useState(false); // 최상위 폴더의 공유 사용자 설정 모달 오픈
  const [editUserFolder, setEditUserFolder] = useState([]); // 수정할 최상위 폴더와 공유 사용자 목록 정보

  const [anchorEl, setAnchorEl] = React.useState(null);

  // 컬럼 추가 시 기본 컬럼
  const defaultCreatedColumn = {
    name: "nonamed",
    parentId: currentFolder,
    managerId: currentUser.id,
  };

  useEffect(() => {
    getParentFolders();
  }, []);

  // 테스크 테마 색상 변경
  const onColorStateChange = (colorState) => {
    const index = themeColorList.findIndex((x) => x.toLowerCase() === colorState.toLowerCase());
    setThemeColor(colorState);
    setSpanColor(spanColorList[index]);
  };

  // 드래그 이벤트
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    // 컬럼이 변경되는 경우: folderId 및 ordering 변경
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const destColumnId = destColumn.id;

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems,
        },
      });

      const destLength = destItems.length;
      let mapLength = 0;

      // 다른 column의 첫 번째에 옮기면
      if (destItems[0] === removed) {
        const task = destItems[0];
        const id = task.id.replace("task", "");
        let data = {};
        // 옮긴 column에 다른 task가 이미 존재하면 맨 마지막 task의 ordering+1을 삽입
        if (destItems[1] !== undefined) {
          data = { ...task, id: id, folderId: destColumnId, ordering: destItems[1].ordering + 1 };
        } else {
          data = { ...task, id: id, folderId: destColumnId, ordering: 0 };
        }
        dispatch(updateTask(data.id, data))
          .then(() => {
            // ordering 업데이트가 모두 끝나면 전체 task를 다시 불러오기
            getFolder(currentFolder);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // 다른 column의 첫 번째가 아닌 다른 위치로 옮기면 해당 column의 tasks들의 ordering을 전부 업데이트
        destItems.forEach((task, i) => {
          const id = task.id.replace("task", "");
          const order = destLength - (i + 1);
          const data = { ...task, id: id, folderId: destColumnId, ordering: order };
          dispatch(updateTask(data.id, data))
            .then(() => {
              mapLength++;
              // ordering 업데이트가 모두 끝나면 전체 task를 다시 불러오기
              if (mapLength === destLength) {
                getFolder(currentFolder);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        });
      }
    } else {
      // 같은 컬럼에서 움직이는 경우: ordering 변경
      const column = columns[source.droppableId];
      const copiedItems = [...column.tasks];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const copiedLength = copiedItems.length;

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedItems,
        },
      });

      // 컬럼의 모든 task들의 ordering을 역순으로 업데이트
      copiedItems.forEach((task, i) => {
        const id = task.id.replace("task", "");
        const order = copiedLength - (i + 1);
        const data = { ...task, id: id, ordering: order };
        dispatch(updateTask(data.id, data));
      });
    }
  };

  // parent가 null인 폴더 조회 (셀렉트박스에 표출)
  const getParentFolders = () => {
    dispatch(retrieveParentFolders(currentUser.id))
      .then((res) => {
        setFolders(res);
        if (currentFolder === undefined || currentFolder === "0") {
          setCurrentFolder(res[0].id);
          getFolder(res[0].id);
        } else {
          getFolder(currentFolder);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 선택된 셀렉트 박스의 폴더에 대한 컬럼 목록(테스크 포함) 조회
  const getFolder = (id) => {
    let params = { parentId: id };
    dispatch(retrieveFolders(params))
      .then((res) => {
        const columns = res;
        if (columns.length > 0) {
          setColumnLastOrderNum(columns[columns.length - 1].ordering);
        } else {
          setColumnLastOrderNum(0);
        }
        let resultColumns = [];
        columns.forEach((column, i) => {
          column.tasks.forEach((task, j) => {
            task.id = "task" + task.id; // task id 앞에 "task" 문자열 삽입
          });
          resultColumns[uuidv4()] = { ...column }; // column을 uuid로 감싸기
        });
        setColumns(resultColumns);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 테스크 등록 버튼 클릭 및 AddTaskForm.js 에서 닫기 버튼 클릭
  const handleAddTaskModalClick = (value) => {
    setAddTaskModalOpen(value);
    getFolder(currentFolder);
  };

  // 테스크 수정 버튼 클릭 및 EditTaskForm.js 에서 닫기 버튼 클릭
  const handleEditTaskModalClick = (value) => {
    setEditTaskModalOpen(value);
    getFolder(currentFolder);
  };

  // 폴더/컬럼 이름 수정 버튼 클릭 및 EditFolderForm.js 에서 닫기 버튼 클릭
  const handleEditFolderModalClick = (value) => {
    setEditFolderModalOpen(value);
    getParentFolders();
  };

  // 최상위 폴더 공유 사용자 설정 버튼 클릭 및 SharedusersForm.js 에서 닫기 버튼 클릭
  const handleEditSharedUserModalClick = (value) => {
    setEditSharedUserModalOpen(value);
    getParentFolders();
  };

  // 셀렉트 박스 변경 이벤트
  const handleSelectChange = (id) => {
    setCurrentFolder(id);
    getFolder(id);
  };

  // 최상위 폴더 추가
  const addParentFolder = () => {
    const folder = { ...defaultCreatedColumn, ordering: 0, parentId: null };
    const user = currentUser;
    const data = { folder, user };
    dispatch(createFolder(data))
      .then((createdFolder) => {
        // 생성한 folder 보여주기
        dispatch(retrieveParentFolders(currentUser.id))
          .then((res) => {
            setFolders(res);
            setCurrentFolder(createdFolder.id);
            getFolder(createdFolder.id);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 최상위 폴더의 공유 유저 설정
  const editSharedUser = (currentFolderId) => {};

  // 최상위 폴더 수정
  const editParentFolder = (id) => {
    dispatch(retrieveFolder(id))
      .then((res) => {
        setEditFolderForm(res);
        handleEditFolderModalClick(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 최상위 폴더 삭제 버튼 클릭
  const confirmRemoveFolder = (id) => {
    confirmAlert({
      closeOnClickOutside: false,
      title: "",
      message: "Are you sure delete this folder with all column?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            removeFolder(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      overlayClassName: css({
        background: "transparent !important",
      }),
    });
  };

  // 최상위 폴더 삭제
  const removeFolder = (id) => {
    dispatch(deleteFolder(id))
      .then(() => {
        // 처음 folder 보여주기
        dispatch(retrieveParentFolders(currentUser.id))
          .then((res) => {
            setFolders(res);
            setCurrentFolder(res[0].id);
            getFolder(res[0].id);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 컬럼 추가
  const addColumn = () => {
    const folder = { ...defaultCreatedColumn, ordering: columnLastOrderNum + 1 };
    const data = { folder };
    dispatch(createFolder(data))
      .then(() => {
        getFolder(currentFolder);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 컬럼 이름 수정 버튼 클릭
  const editColumn = (column) => {
    setEditFolderForm(column);
    handleEditFolderModalClick(true);
  };

  // 컬럼 삭제 버튼 클릭
  const confirmRemoveColumn = (id) => {
    confirmAlert({
      closeOnClickOutside: false,
      title: "",
      message: "Are you sure delete this column with all task?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            removeColumn(id);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      overlayClassName: css({
        background: "transparent !important",
      }),
    });
  };

  // 테스크 포함 컬럼 삭제
  const removeColumn = (id) => {
    dispatch(deleteFolder(id))
      .then(() => {
        getFolder(currentFolder);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 컬럼 ordering 변경 (back)
  const columnOrderingBack = (column) => {
    let data = {};
    // 첫 번째 컬럼이 아니면
    if (column.ordering > 0) {
      // 클릭한 컬럼의 ordering에 1을 뺌
      data = { ...column, ordering: column.ordering - 1 };
      dispatch(updateFolder(data.id, data))
        .then(() => {
          // 수정된 클릭한 컬럼의 ordering이 같은 컬럼을 조회
          const updateAwaitColumn = Object.values(columns).find((x) => x.ordering === data.ordering && x.id !== data.id);
          // 조회한 컬럼의 ordering에 1을 더함 (위치 변경)
          const d = { ...updateAwaitColumn, ordering: updateAwaitColumn.ordering + 1 };
          dispatch(updateFolder(d.id, d))
            .then(() => {
              getFolder(currentFolder);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // 컬럼 ordering 변경 (forward))
  const columnOrderingForward = (column) => {
    let data = {};
    // 마지막 컬럼이 아니면
    // if (column.ordering > 0) {
    // 클릭한 컬럼의 ordering에 1을 더함
    data = { ...column, ordering: column.ordering + 1 };
    dispatch(updateFolder(data.id, data))
      .then(() => {
        console.log(12);
        // 수정된 클릭한 컬럼의 ordering이 같은 컬럼을 조회
        const updateAwaitColumn = Object.values(columns).find((x) => x.ordering === data.ordering && x.id !== data.id);
        // 조회한 컬럼의 ordering에 1을 뺌 (위치 변경)
        const d = { ...updateAwaitColumn, ordering: updateAwaitColumn.ordering - 1 };
        dispatch(updateFolder(d.id, d))
          .then(() => {
            getFolder(currentFolder);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 테스크 추가 버튼 클릭
  const addTask = (column) => {
    setAddColumnForm(column);
    handleAddTaskModalClick(true);
  };

  // 테스크 제목 클릭 시 editTaskForm 설정 및 상세보기 모달 표출
  const taskTitleClick = (task) => {
    setEditTaskForm(task);
    handleEditTaskModalClick(true);
  };

  // 테스크 삭제 버튼 클릭
  const confirmRemoveTask = (id) => {
    confirmAlert({
      closeOnClickOutside: false,
      title: "",
      message: "Are you sure delete this task?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            id = id.replace("task", "");
            dispatch(deleteTask(id))
              .then(() => {
                getFolder(currentFolder);
              })
              .catch((e) => {
                console.log(e);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
      overlayClassName: css({
        background: "transparent !important",
      }),
    });
  };

  // 테스크 체크박스 클릭
  const handleCheckbox = (e, task) => {};

  return (
    <>
      <div className={s.root}>
        <h2 className="page-title">
          Drag & Drop - <span className="fw-semi-bold">Task</span>
        </h2>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Widget>
              <h3>
                <span className="fw-semi-bold">My Task</span>
              </h3>
              <p>
                {"Indicates a To-Do of "}
                <code>my task</code> with title, description, date.
              </p>
              <div>
                <InputGroup className="input-group-no-border" style={{ width: "250px", display: "inline-flex" }}>
                  {folders.length > 0 && folders.find((x) => x.id === parseInt(currentFolder)) ? (
                    <Input
                      id="column"
                      className="input-transparent pl-3"
                      type="select"
                      name="column"
                      value={currentFolder}
                      onChange={(e) => handleSelectChange(e.target.value)}
                    >
                      {folders &&
                        folders.map((folder, index) => {
                          return (
                            <option value={folder.id} key={folder.id}>
                              {folder.name}
                            </option>
                          );
                        })}
                    </Input>
                  ) : null}
                </InputGroup>
                &nbsp;&nbsp;
                <Button color="default" className={s.transparentButton} size="xs" onClick={() => editSharedUser(currentFolder)}>
                  <i className="fa fa-users"></i> Shared
                </Button>
                &nbsp;&nbsp;
                <Button color="inverse" className={s.transparentButton} size="xs" onClick={() => editParentFolder(currentFolder)}>
                  <i className="fa fa-pencil"></i> Edit
                </Button>
                &nbsp;&nbsp;
                <Button color="inverse" className={s.transparentButton} size="xs" onClick={() => confirmRemoveFolder(currentFolder)}>
                  <i className="fa fa-remove"></i> Delete
                </Button>
                <div className={s.themeColorPicker}>
                  <CirclePicker colors={themeColorList} circleSize={20} onChangeComplete={(colore) => onColorStateChange(colore.hex)} />
                </div>
              </div>
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Button color="inverse" className={s.transparentButton} size="xs" onClick={addParentFolder}>
                  <i className="fa fa-plus"></i> Folder
                </Button>
                &nbsp;&nbsp;
                <Button color="inverse" className={s.transparentButton} size="xs" onClick={addColumn}>
                  <i className="fa fa-plus"></i> Column
                </Button>
              </div>

              <div className={s.wrapper}>
                <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                  {columns &&
                    Object.entries(columns).map(([columnId, column], index, { length }) => {
                      return (
                        <>
                          <div className={s.columns} key={columnId}>
                            <Widget>
                              <Button
                                color=""
                                className={s.transparentButton}
                                size="xs"
                                style={{ color: "rgba(244, 244, 245, 0.6)" }}
                                onClick={() => addTask(column)}
                              >
                                <i className="fa fa-plus"></i>
                              </Button>
                              <div style={{ float: "right" }}>
                                {index > 0 ? (
                                  <Button color="" className={s.transparentButton} size="xs" onClick={() => columnOrderingBack(column)}>
                                    <i className="fa fa-arrow-left"></i>
                                  </Button>
                                ) : null}
                                {column.name}
                                <Button color="" className={s.transparentButton} size="xs" onClick={() => editColumn(column)}>
                                  <i className="fa fa-pencil"></i>
                                </Button>
                                <Button color="" className={s.transparentButton} size="xs" onClick={() => confirmRemoveColumn(column.id)}>
                                  <i className="fa fa-remove"></i>
                                </Button>
                                {index + 1 < length ? (
                                  <Button color="" className={s.transparentButton} size="xs" onClick={() => columnOrderingForward(column)}>
                                    <i className="fa fa-arrow-right"></i>
                                  </Button>
                                ) : null}
                              </div>
                              <div className={s.droppableWrapper}>
                                <Droppable droppableId={columnId} key={columnId}>
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        className={s.droppableZone}
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                          background: snapshot.isDraggingOver ? "rgba(255, 220, 40, 0.15)" : "",
                                        }}
                                      >
                                        {column.tasks &&
                                          column.tasks.map((item, index) => {
                                            return (
                                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided, snapshot) => {
                                                  return (
                                                    <div
                                                      className={s.droppableItem}
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                      style={{
                                                        backgroundColor: snapshot.isDragging ? "#263B4A" : themeColor,
                                                        // backgroundColor: snapshot.isDragging ? "#263B4A" : "#706D22",
                                                        ...provided.draggableProps.style,
                                                      }}
                                                    >
                                                      {item.labelColor && item.labelColor ? (
                                                        <div className={s.circleLabel} style={{ background: item.labelColor }}></div>
                                                      ) : null}
                                                      <div className={s.right}>
                                                        <Button
                                                          color=""
                                                          className={s.transparentButton}
                                                          size="xs"
                                                          onClick={() => confirmRemoveTask(item.id)}
                                                        >
                                                          <i className="fa fa-remove"></i>
                                                        </Button>
                                                      </div>
                                                      <span
                                                        className={s.titleSpan}
                                                        onClick={() => {
                                                          taskTitleClick(item);
                                                        }}
                                                      >
                                                        {item.title}
                                                      </span>
                                                      <div style={{ height: "5px" }}></div>
                                                      <span style={{ fontSize: "10px" }}>
                                                        {item.dueDate ? (
                                                          <>
                                                            <input type="checkbox" checked={item.isDone} onChange={(e) => handleCheckbox(e)} />
                                                            <label>
                                                              &nbsp;
                                                              <Moment
                                                                format="YYYY-MM-DD HH:mm:ss"
                                                                style={{
                                                                  color:
                                                                    item.dueDate && today === new Date(item.dueDate).toISOString().slice(0, 10)
                                                                      ? spanColor
                                                                      : null,
                                                                }}
                                                              >
                                                                {item.dueDate}
                                                              </Moment>
                                                            </label>
                                                          </>
                                                        ) : null}
                                                      </span>
                                                    </div>
                                                  );
                                                }}
                                              </Draggable>
                                            );
                                          })}
                                        {provided.placeholder}
                                      </div>
                                    );
                                  }}
                                </Droppable>
                              </div>
                              <div style={{ fontSize: "11px", fontStyle: "italic", textAlign: "right" }}>
                                created by&nbsp; {column.manager ? column.manager.account : null}
                              </div>
                            </Widget>
                          </div>
                        </>
                      );
                    })}
                </DragDropContext>
              </div>
            </Widget>
          </Col>
        </Row>
        <AddTaskModal open={addTaskModalOpen} handleCloseClick={handleAddTaskModalClick} column={addColumnForm} />
        <EditTaskModal open={editTaskModalOpen} handleCloseClick={handleEditTaskModalClick} task={editTaskForm} />
        <EditFolderModal open={editFolderModalOpen} handleCloseClick={handleEditFolderModalClick} folder={editFolderForm} />
      </div>
    </>
  );
}
