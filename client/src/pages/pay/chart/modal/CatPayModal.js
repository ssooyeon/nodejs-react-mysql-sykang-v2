import React, { useState, useEffect } from "react";
import { Table, Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Moment from "react-moment";
import moment from "moment/moment";

import "./CatPayModal.css";

import PayService from "../../../../services/PayService";

export default function CatPayModal({ open, handleCloseClick, user, date, catId, viewMode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const start = date + "-01";
    const dt = new Date(date);
    const end = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);

    if (viewMode === "cat") {
      const params = { userId: user.id, start: start, end: moment(end).format("YYYY-MM-DD"), parentId: catId };
      PayService.getAllByCatMonthly(params)
        .then((res) => {
          setData(res.data);
        })
        .catch((e) => console.log(e));
    } else if (viewMode === "subcat") {
      const params = { userId: user.id, start: start, end: moment(end).format("YYYY-MM-DD"), catId: catId };
      PayService.getAllBySubCatMonthly(params)
        .then((res) => {
          setData(res.data);
        })
        .catch((e) => console.log(e));
    }
  }, [user, date, catId, viewMode]);

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
  };

  return (
    <>
      <Modal size="lg" isOpen={open} toggle={handleClose} backdrop={false} centered>
        <ModalBody>
          <span className="fw-semi-bold">Monthly payment by Category</span>
          <Table className="table-hover daily-payment-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Assert</th>
                <th>Cat</th>
                <th>Descripion</th>
                <th>Date</th>
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
                      <td>{pay.cat ? pay.cat.parent.name + ": " + pay.cat.name : "-"}</td>
                      {pay.description && pay.description.length > 15 ? (
                        <td title={pay.description}>{pay.description.substr(0, 15) + "..."}</td>
                      ) : (
                        <td>{pay.description ? pay.description : "-"}</td>
                      )}
                      <td>{<Moment format="YYYY-MM-DD HH:mm">{pay.date}</Moment>}</td>
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
    </>
  );
}
