import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import Swal from "sweetalert2";
import Moment from "react-moment";

import Widget from "../../components/Widget";
import s from "./Inbox.module.scss";
import "./Inbox.css";

import { retrieveInboxs, updateInbox, deleteInbox } from "../../actions/inboxs";

import InboxService from "../../services/InboxService";
import AddInboxModal from "./inbox/AddInboxModal";

export default function Inbox() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const inboxs = useSelector((state) => state.inboxs || []);

  const [section, setSection] = useState("inbox"); // sidebar clicked section
  const [counts, setCounts] = useState(null); // sidebar folder's inbox count
  const [selectedRowIds, setSelectedRowIds] = useState([]); // selected checkbox in inbox list

  const inboxRef = useRef(null);
  const sentRef = useRef(null);
  const trashRef = useRef(null);

  const [selectedInbox, setSelectedInbox] = useState(null); // selected mail

  const [addInboxModalOpen, setAddInboxModalOpen] = useState(false); // Inbox 생성 모달 오픈

  const dispatch = useDispatch();

  useEffect(() => {
    // 최초 접근 시 inbox sidebar active
    inboxRef.current.classList.add("selected");

    // inbox의 mail list 조회
    const params = { ownerId: currentUser.id, folderName: "inbox" };
    dispatch(retrieveInboxs(params))
      .then(() => {
        readConfirmedCount();
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentUser, dispatch]);

  /*********************************** */
  /* sidebar */
  /*********************************** */
  // isConfirmed count 조회
  const readConfirmedCount = () => {
    const param = { ownerId: currentUser.id };
    InboxService.getCount(param)
      .then((data) => {
        if (data !== null) {
          const cnts = data.data;
          setCounts(cnts);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // sidebar folder 클릭
  const loadSection = (section, ref) => {
    setSelectedRowIds([]);
    setSection(section);
    inboxRef.current.classList.remove("selected");
    sentRef.current.classList.remove("selected");
    trashRef.current.classList.remove("selected");
    ref.current.classList.add("selected");

    // 클릭한 sidebar folder의 inbox list 가져오기
    const params = { ownerId: currentUser.id, folderName: section };
    dispatch(retrieveInboxs(params))
      .then(() => {
        setSelectedInbox(null);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /*********************************** */
  /* inbox mail list */
  /*********************************** */
  // inbox mail list의 checkbox 클릭
  const handleCheckbox = (e, inboxId) => {
    if (e.target.checked) {
      setSelectedRowIds([...selectedRowIds, inboxId]);
    } else {
      setSelectedRowIds(selectedRowIds.filter((d) => d !== inboxId));
    }
  };

  // select all 클릭
  const handleSelectAll = () => {
    const ids = inboxs.map((inbox) => inbox.id);
    setSelectedRowIds(ids);
  };
  // deselect all 클릭
  const handleDeselectAll = () => {
    setSelectedRowIds([]);
  };

  // mark read 클릭
  const handleMarkRead = () => {
    const ids = selectedRowIds;
    ids.forEach((id) => {
      const data = { id: id, isConfirmed: true };
      modifyInbox(data);
    });
  };

  // to trash 클릭
  const handleToTrash = () => {
    const ids = selectedRowIds;
    ids.forEach((id) => {
      const data = { id: id, folderName: "trash" };
      modifyFolder(data);
    });
  };

  // remove 클릭
  const handleRemove = () => {
    const ids = selectedRowIds;
    ids.forEach((id) => {
      dispatch(deleteInbox(id))
        .then(() => {
          setSelectedInbox(null);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  // inbox 클릭
  const handleInboxClick = (inbox) => {
    setSelectedInbox(inbox);
    // isConfirmed=true
    const data = { ...inbox, isConfirmed: true };
    modifyInbox(data);
  };

  // inbox 실제 업데이트 수행
  const modifyInbox = (data) => {
    dispatch(updateInbox(data.id, data))
      .then(() => {
        // isConfirmed count 재조회
        const params = { ownerId: currentUser.id };
        InboxService.getCount(params)
          .then((data) => {
            if (data !== null) {
              const cnts = data.data;
              setCounts(cnts);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /*********************************** */
  /* inbox mail detail */
  /*********************************** */
  // inbox mail 삭제
  const confirmDeleteInbox = (id) => {
    Swal.fire({
      text: "Are you sure this mail to the trash? or to delete it completely?",
      icon: "warning",
      backdrop: false,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "trash",
      denyButtonText: "delete",
      confirmButtonColor: "#db7329",
      denyButtonColor: "#da2837",
      cancelButtonColor: "#30324d",
      showClass: {
        backdrop: "swal2-noanimation",
        icon: "",
      },
    }).then((result) => {
      // go to trash
      if (result.isConfirmed) {
        const data = { ...selectedInbox, isConfirmed: true, folderName: "trash" };
        modifyFolder(data);
      }
      // delete completely
      else if (result.isDenied) {
        dispatch(deleteInbox(id))
          .then(() => {
            setSelectedInbox(null);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  // inbox mail을 다른 폴더로 이동
  const modifyFolder = (data) => {
    dispatch(updateInbox(data.id, data))
      .then(() => {
        const params = { ownerId: currentUser.id, folderName: section };
        dispatch(retrieveInboxs(params))
          .then(() => {
            setSelectedInbox(null);
            readConfirmedCount();
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // trash의 inbox mail detail에서 inbox mail 완전 삭제
  const confirmCompletelyDeleteInbox = (id) => {
    Swal.fire({
      text: "Are you sure this mail to delete it completely?",
      icon: "warning",
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#da2837",
      cancelButtonColor: "#30324d",
      showClass: {
        backdrop: "swal2-noanimation",
        icon: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInbox(id))
          .then(() => {
            setSelectedInbox(null);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  };

  /*********************************** */
  /* inbox create */
  /*********************************** */

  const addInbox = () => {
    handleAddInboxModalClick(true);
  };

  // Inbox 등록 버튼 클릭 및 AddInboxForm.js 에서 닫기 버튼 클릭
  const handleAddInboxModalClick = (value) => {
    setAddInboxModalOpen(value);
    const params = { ownerId: currentUser.id, folderName: section };
    dispatch(retrieveInboxs(params))
      .then(() => {
        readConfirmedCount();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Mail - <span className="fw-semi-bold">Inbox</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Inboxs</span>
            </h3>
            <p>
              {"Indicates a list of "}
              Indicates a mail of <code>my inbox</code> using <code>gmail</code>.
            </p>
            <br />
            <div className={s.overFlow}>
              <div>
                <div className={s.inbox_sidebar}>
                  <div className={s.sidebar__compose}>
                    <Button color="warning" className={s.new_button} size="xs" onClick={addInbox}>
                      New &nbsp;<i className="fa fa-pencil"></i>
                    </Button>
                  </div>
                  <ul className={s.sidebar__inboxes}>
                    <li ref={inboxRef} onClick={() => loadSection("inbox", inboxRef)}>
                      <div>
                        <span className="fa fa-inbox"></span> Inbox
                        <span className={s.item_count}>
                          {counts && counts.filter((x) => x.folderName === "inbox")[0] !== undefined
                            ? counts.filter((x) => x.folderName === "inbox")[0].count
                            : 0}
                        </span>
                      </div>
                    </li>
                    <li ref={sentRef} onClick={() => loadSection("sent", sentRef)}>
                      <div>
                        <span className="fa fa-paper-plane"></span> Sent
                        <span className={s.item_count}>
                          {counts && counts.filter((x) => x.folderName === "sent")[0] !== undefined
                            ? counts.filter((x) => x.folderName === "sent")[0].count
                            : 0}
                        </span>
                      </div>
                    </li>
                    <li ref={trashRef} onClick={() => loadSection("trash", trashRef)}>
                      <div>
                        <span className="fa fa-trash-o"></span> Trash
                        <span className={s.item_count}>
                          {counts && counts.filter((x) => x.folderName === "trash")[0] !== undefined
                            ? counts.filter((x) => x.folderName === "trash")[0].count
                            : 0}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className={s.inbox_container}>
                  <div className={s.email_list}>
                    <div>
                      {selectedRowIds.length === inboxs.length ? (
                        <Button color="inverse" className={s.item_btn} size="xs" onClick={() => handleDeselectAll()}>
                          deselect all
                        </Button>
                      ) : (
                        <Button color="inverse" className={s.item_btn} size="xs" onClick={() => handleSelectAll()}>
                          select all
                        </Button>
                      )}
                      &nbsp;
                      <Button color="inverse" className={s.item_btn} size="xs" onClick={() => handleMarkRead()}>
                        mark read
                      </Button>
                      &nbsp;
                      {section !== "trash" ? (
                        <>
                          <Button color="inverse" className={s.item_btn} size="xs" onClick={() => handleToTrash()}>
                            to trash
                          </Button>
                          &nbsp;
                        </>
                      ) : null}
                      <Button color="inverse" className={s.item_btn} size="xs" onClick={() => handleRemove()}>
                        remove
                      </Button>
                    </div>
                    {inboxs.map((inbox) => {
                      return (
                        <div key={inbox.id}>
                          <div style={{ display: "flex" }}>
                            <div className={s.email_item__checkbox_div}>
                              <input
                                type="checkbox"
                                className={s.email_item__checkbox}
                                onChange={(e) => handleCheckbox(e, inbox.id)}
                                checked={selectedRowIds.includes(inbox.id) ? true : false}
                              />
                            </div>
                            <div
                              onClick={() => handleInboxClick(inbox)}
                              className={s.email_item}
                              style={{ background: selectedInbox !== null && inbox.id === selectedInbox.id ? "#11121a" : null }}
                            >
                              <div className={s.email_item__unread_dot} data-read={inbox.isConfirmed}></div>
                              <div className={s.email_item__subject + s.truncate} style={{ color: !inbox.isConfirmed ? "#fff" : null }}>
                                {inbox.title}
                              </div>
                              <div className={s.email_item__details}>
                                <span className={s.email_item__from + s.truncate} style={{ color: !inbox.isConfirmed ? "#fff" : null }}>
                                  {inbox.sender ? inbox.sender.account : null}
                                </span>
                                <span
                                  className={s.email_item__time + s.truncate}
                                  style={{ float: "right", color: !inbox.isConfirmed ? "#fff" : null }}
                                >
                                  <Moment format="YYYY-MM-DD HH:mm">{inbox.createdAt}</Moment>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={s.email_content}>
                    {selectedInbox ? (
                      <>
                        <div className={s.email_content__header}>
                          <h3 className={s.email_content__subject}>
                            {selectedInbox.title}
                            <Button
                              color="inverse"
                              className={s.email_content__remove_btn}
                              size="xs"
                              onClick={
                                selectedInbox.folderName === "trash"
                                  ? () => {
                                      confirmCompletelyDeleteInbox(selectedInbox.id);
                                    }
                                  : () => confirmDeleteInbox(selectedInbox.id)
                              }
                            >
                              <i className="fa fa-trash"></i>
                            </Button>
                          </h3>
                          <div className={s.email_content__time}>
                            <Moment format="YYYY-MM-DD HH:mm">{selectedInbox.createdAt}</Moment>
                          </div>
                          <div className={s.email_content__from}>from: {selectedInbox.sender.account}</div>
                          <div className={s.email_content__from}>to: {selectedInbox.receiver !== null ? selectedInbox.receiver.account : "-"}</div>
                        </div>
                        <div className={s.email_content__message}>{selectedInbox.content}</div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Widget>
        </Col>
      </Row>
      <AddInboxModal open={addInboxModalOpen} handleCloseClick={handleAddInboxModalClick} />
    </div>
  );
}
