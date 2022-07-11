import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";
import Swal from "sweetalert2";
import Moment from "react-moment";

import Widget from "../../../components/Widget";
import s from "./PayList.module.scss";

import { retrievePays, deletePay } from "../../../actions/pays";
import { retrieveAsserts } from "../../../actions/payasserts";
import { retrieveCats } from "../../../actions/paycats";

import AddPayModal from "./AddPayModal";
import EditPayModal from "./EditPayModal";

const pageSize = 5;

export default function PayList({ user, someUpdate }) {
  const pays = useSelector((state) => state.pays || []);
  const asserts = useSelector((state) => state.asserts || []);
  const cats = useSelector((state) => state.cats || []);

  const dispatch = useDispatch();

  const [paysCurrentPage, setPaysCurrentPage] = useState(0);

  const [payAddModalOpen, setPayAddModalOpen] = useState(false);
  const [payEditModalOpen, setPayEditModalOpen] = useState(false);
  const [editPay, setEditPay] = useState([]);

  useEffect(() => {
    dispatch(retrievePays({ userId: user.id }));
    dispatch(retrieveAsserts({ userId: user.id }));
    dispatch(retrieveCats({ userId: user.id }));
  }, [user, dispatch]);

  // payment 테이블 페이징
  const handlePayTablePaging = (selectedPage) => {
    setPaysCurrentPage(selectedPage - 1);
  };

  // payment 등록 버튼 클릭 및 AddPayModal.js에서 닫기 버튼 클릭
  const handlePayAddModalClick = (value, isDone) => {
    setPayAddModalOpen(value);
    if (isDone) {
      dispatch(retrievePays({ userId: user.id }));
      someUpdate();
    }
  };

  // payment 수정 버튼 클릭 및 EditPayModal.js 닫기 버튼 클릭
  const handlePayEditModalClick = (value, isDone) => {
    setPayEditModalOpen(value);
    if (isDone) {
      dispatch(retrievePays({ userId: user.id }));
      someUpdate();
    }
  };

  // payment 테이블의 Edit 버튼 클릭
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
            someUpdate();
          })
          .catch((e) => console.log(e));
      }
    });
  };

  return (
    <>
      <Widget>
        <h3>
          <span className="fw-semi-bold">Daily</span>
          <div className="float-right">
            <Button color="default" className="mr-2" size="sm" onClick={() => handlePayAddModalClick(true)}>
              Add
            </Button>
          </div>
        </h3>
        <p>
          {"Indicates a list of "}
          <code>daily payment</code> in row.
        </p>
        <br />
        <div className={s.overFlow}>
          <Table className="table-hover">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Assert</th>
                <th>Cat</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* eslint-disable */}
            <tbody style={{ minWidth: "" }}>
              {pays &&
                pays.slice(paysCurrentPage * pageSize, (paysCurrentPage + 1) * pageSize).map((pay) => {
                  return (
                    <tr key={pay.id}>
                      <td style={{ color: pay.amount < 0 ? "#dd2222" : "#7676fb" }}>{pay.amount.toLocaleString()}</td>
                      <td>{pay.assert ? pay.assert.name : "-"}</td>
                      <td>{pay.cat ? pay.cat.name : "-"}</td>
                      <td>{<Moment format="YYYY-MM-DD HH:mm">{pay.date}</Moment>}</td>
                      <td>
                        <Button color="default" className="mr-2" size="xs" onClick={(e) => onPayEditClick(pay)}>
                          E
                        </Button>
                        <Button color="inverse" className="mr-2" size="xs" onClick={(e) => onPayDeleteClick(pay.id)}>
                          D
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            {/* eslint-enable */}
          </Table>
          <div className={s.payPaging}>
            <PaginationComponent
              size="sm"
              totalItems={pays.length}
              pageSize={pageSize}
              defaultActivePage={1}
              firstPageText="<<"
              previousPageText="<"
              nextPageText=">"
              lastPageText=">>"
              onSelect={handlePayTablePaging}
            />
          </div>
        </div>
      </Widget>

      <AddPayModal open={payAddModalOpen} handleCloseClick={handlePayAddModalClick} asserts={asserts} cats={cats} />
      <EditPayModal open={payEditModalOpen} handleCloseClick={handlePayEditModalClick} asserts={asserts} cats={cats} pay={editPay} />
    </>
  );
}
