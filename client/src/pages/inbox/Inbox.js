import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, FormGroup, InputGroup } from "reactstrap";
import Swal from "sweetalert2";
import Moment from "react-moment";
import moment from "moment";

import Widget from "../../components/Widget";
import s from "./Inbox.module.scss";
import "./Inbox.css";

import { retrieveInboxs, updateInbox, deleteInbox } from "../../actions/inboxs";

import InboxService from "../../services/InboxService";

export default function Inbox() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const inboxs = useSelector((state) => state.inboxs || []);

  const [section, setSection] = useState("inbox");
  const [counts, setCounts] = useState(null);

  const inboxRef = useRef(null);
  const sentRef = useRef(null);
  const draftsRef = useRef(null);
  const trashRef = useRef(null);

  const [selectedInbox, setSelectedInbox] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    // 최초 접근 시 inbox sidebar active
    inboxRef.current.classList.add("selected");

    // inbox의 mail list 조회
    const params = { receiverId: currentUser.id, folderName: "inbox" };
    dispatch(retrieveInboxs(params));

    // isConfirmed count 조회
    const param = { receiverId: currentUser.id };
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
  }, [currentUser, dispatch]);

  // sidebar folder 클릭
  const loadSection = (section, ref) => {
    setSection(section);
    inboxRef.current.classList.remove("selected");
    sentRef.current.classList.remove("selected");
    draftsRef.current.classList.remove("selected");
    trashRef.current.classList.remove("selected");
    ref.current.classList.add("selected");

    // 클릭한 folder의 inbox list 가져오기
    const params = { receiverId: currentUser.id, folderName: section };
    dispatch(retrieveInboxs(params))
      .then(() => {
        setSelectedInbox(null);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // inbox 클릭
  const handleInboxClick = (inbox) => {
    setSelectedInbox(inbox);
    // isConfirmed=true
    const data = { ...inbox, isConfirmed: true };
    dispatch(updateInbox(data.id, data))
      .then(() => {
        // isConfirmed count 재조회
        const params = { receiverId: currentUser.id };
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
                    <Button color="warning" className={s.new_button} size="xs" onClick={() => {}}>
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
                    <li ref={draftsRef} onClick={() => loadSection("drafts", draftsRef)}>
                      <div>
                        <span className="fa fa-pencil-square-o"></span> Drafts
                        <span className={s.item_count}>
                          {counts && counts.filter((x) => x.folderName === "drafts")[0] !== undefined
                            ? counts.filter((x) => x.folderName === "drafts")[0].count
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
                    {inboxs.map((inbox) => {
                      return (
                        <div onClick={() => handleInboxClick(inbox)} className={s.email_item} key={inbox.id}>
                          <div className={s.email_item__unread_dot} data-read={inbox.isConfirmed}></div>
                          <div className={s.email_item__subject + s.truncate}>{inbox.title}</div>
                          <div className={s.email_item__details}>
                            <span className={s.email_item__from + s.truncate}>{inbox.sender.account}</span>
                            <span className={s.email_item__time + s.truncate} style={{ float: "right" }}>
                              <Moment format="YYYY-MM-DD HH:mm">{inbox.createdAt}</Moment>
                            </span>
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
                            <Button color="inverse" className={s.email_content__remove_btn} size="xs" onClick={() => {}}>
                              <i className="fa fa-remove"></i>
                            </Button>
                          </h3>
                          <div className={s.email_content__time}>
                            <Moment format="YYYY-MM-DD HH:mm">{selectedInbox.createdAt}</Moment>
                          </div>
                          <div className={s.email_content__from}>sender: {selectedInbox.sender.account}</div>
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
    </div>
  );
}
