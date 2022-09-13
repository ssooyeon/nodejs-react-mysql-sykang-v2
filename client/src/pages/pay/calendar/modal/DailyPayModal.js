import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Swal from "sweetalert2";
import Moment from "react-moment";
import moment from "moment/moment";

import "./DailyPayModal.css";

import { retrievePays, deletePay } from "../../../../actions/pays";

import PayService from "../../../../services/PayService";

import AddPayModal from "../../pay/modal/AddPayModal";
import EditPayModal from "../../pay/modal/EditPayModal";

export default function DailyPayModal({ open, someUpdate, handleCloseClick, user, date, type }) {
  const asserts = useSelector((state) => state.asserts || []);
  const cats = useSelector((state) => state.cats || []);

  const [data, setData] = useState([]);
  const [payAddModalOpen, setPayAddModalOpen] = useState(false);
  const [payEditModalOpen, setPayEditModalOpen] = useState(false);
  const [editPay, setEditPay] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // calendar에서 날짜 클릭
    if (type === "daily") {
      const ymd = moment(date).format("YYYY-MM-DD");
      const params = { userId: user.id, date: ymd };
      PayService.getAll(params)
        .then((res) => {
          setData(res.data);
        })
        .catch((e) => console.log(e));
    }
    // monthly 클릭
    else if (type === "monthly") {
      const start = date + "-01";
      const dt = new Date(date);
      const end = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);

      const params = { userId: user.id, start: start, end: moment(end).format("YYYY-MM-DD") };
      PayService.getAllByDate(params)
        .then((res) => {
          setData(res.data);
        })
        .catch((e) => console.log(e));
    }
    // weekly 클릭
    else if (type === "weekly") {
      if (typeof date === "string") {
        const weeks = date.split(" ~ ");
        const params = { userId: user.id, start: weeks[0], end: weeks[1] };
        PayService.getAllByDate(params)
          .then((res) => {
            setData(res.data);
          })
          .catch((e) => console.log(e));
      }
    }
  }, [user, date, type]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
  };

  // daily payment 등록 버튼 클릭 및 AddPayModal.js에서 닫기 버튼 클릭
  const handlePayAddModalClick = (value, isDone) => {
    setPayAddModalOpen(value);
    if (isDone) {
      dispatch(retrievePays({ userId: user.id }));
      getData();
      someUpdate();
    }
  };

  // daily payment 수정 버튼 클릭 및 EditPayModal.js 닫기 버튼 클릭
  const handlePayEditModalClick = (value, isDone) => {
    setPayEditModalOpen(value);
    if (isDone) {
      dispatch(retrievePays({ userId: user.id }));
      getData();
      someUpdate();
    }
  };

  // daily payment 테이블의 Edit 버튼 클릭
  const onPayEditClick = (row) => {
    setPayEditModalOpen(true);
    setEditPay(row);
  };

  // payment 테이블의 Delete 버튼 클릭
  const onPayDeleteClick = (payId) => {
    Swal.fire({
      text: "Are you sure delete this payment?",
      icon: "warning",
      backdrop: false,
      showCancelButton: true,
      confirmButtonColor: "#da2837",
      cancelButtonColor: "#30324d",
      confirmButtonText: "OK",
      showClass: {
        backdrop: "swal2-noanimation",
        icon: "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePay(payId))
          .then(() => {
            getData();
            someUpdate();
          })
          .catch((e) => console.log(e));
      }
    });
  };

  const getData = () => {
    const ymd = moment(date).format("YYYY-MM-DD");
    const params = { userId: user.id, date: ymd };
    PayService.getAll(params)
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Modal size="lg" isOpen={open} toggle={handleClose} backdrop={false} centered>
        <ModalBody>
          <span className="fw-semi-bold">Daily payment</span>
          {type === "daily" ? (
            <div className="float-right">
              <Button color="default" className="mr-2" size="sm" onClick={() => handlePayAddModalClick(true)}>
                Add
              </Button>
            </div>
          ) : null}
          <Table className="table-hover daily-payment-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Assert</th>
                <th>Cat</th>
                <th>Descripion</th>
                <th>Date</th>
                {type === "daily" ? <th>Action</th> : null}
              </tr>
            </thead>
            {/* eslint-disable */}
            <tbody style={{ minWidth: "" }}>
              {data &&
                data.map((pay) => {
                  return (
                    <tr key={pay.id}>
                      <td style={{ color: pay.amount < 0 ? "#dd2222" : "#7676fb" }}>{pay.amount.toLocaleString()}</td>
                      <td>{pay.assert ? pay.assert.name : "-"}</td>
                      <td>{pay.cat ? pay.cat.name : "-"}</td>
                      {pay.description && pay.description.length > 15 ? (
                        <td title={pay.description}>{pay.description.substr(0, 15) + "..."}</td>
                      ) : (
                        <td>{pay.description ? pay.description : "-"}</td>
                      )}
                      <td>{<Moment format="YYYY-MM-DD HH:mm">{pay.date}</Moment>}</td>
                      {type === "daily" ? (
                        <td>
                          <Button color="default" className="mr-2" size="xs" onClick={(e) => onPayEditClick(pay)}>
                            E
                          </Button>
                          <Button color="inverse" className="mr-2" size="xs" onClick={(e) => onPayDeleteClick(pay.id)}>
                            D
                          </Button>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <AddPayModal open={payAddModalOpen} handleCloseClick={handlePayAddModalClick} asserts={asserts} cats={cats} date={date} />
      <EditPayModal open={payEditModalOpen} handleCloseClick={handlePayEditModalClick} asserts={asserts} cats={cats} pay={editPay} />
    </>
  );
}
