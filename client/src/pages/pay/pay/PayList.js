import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, FormGroup } from "reactstrap";
import PaginationComponent from "react-reactstrap-pagination";
import Swal from "sweetalert2";
import DatePicker from "react-date-picker";
import Moment from "react-moment";
import moment from "moment/moment";

import Widget from "../../../components/Widget";
import s from "./PayList.module.scss";

import { deletePay } from "../../../actions/pays";
import { retrieveAsserts } from "../../../actions/payasserts";
import { retrieveCats } from "../../../actions/paycats";

import PayService from "../../../services/PayService";

import AddPayModal from "./modal/AddPayModal";
import EditPayModal from "./modal/EditPayModal";

const pageSize = 5;

export default function PayList({ user, someUpdate, isListUpdated }) {
  const asserts = useSelector((state) => state.asserts || []);
  const cats = useSelector((state) => state.cats || []);

  const dispatch = useDispatch();

  const [pays, setPays] = useState([]);
  const [paysCurrentPage, setPaysCurrentPage] = useState(0);

  const [payAddModalOpen, setPayAddModalOpen] = useState(false);
  const [payEditModalOpen, setPayEditModalOpen] = useState(false);
  const [editPay, setEditPay] = useState([]);
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth() - 3));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    getData();
    dispatch(retrieveAsserts({ userId: user.id }));
    dispatch(retrieveCats({ userId: user.id }));
  }, [user, dispatch, isListUpdated]);

  // payment 테이블 페이징
  const handlePayTablePaging = (selectedPage) => {
    setPaysCurrentPage(selectedPage - 1);
  };

  // payment 등록 버튼 클릭 및 AddPayModal.js에서 닫기 버튼 클릭
  const handlePayAddModalClick = (value, isDone) => {
    setPayAddModalOpen(value);
    if (isDone) {
      getData();
      someUpdate();
    }
  };

  // payment 수정 버튼 클릭 및 EditPayModal.js 닫기 버튼 클릭
  const handlePayEditModalClick = (value, isDone) => {
    setPayEditModalOpen(value);
    if (isDone) {
      getData();
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
            getData();
            someUpdate();
          })
          .catch((e) => console.log(e));
      }
    });
  };

  // payment 테이블 날짜 검색
  const onPaySearchClick = () => {
    getData();
  };

  const getData = () => {
    const sdt = moment(startDate).format("YYYY-MM-DD");
    const edt = moment(endDate).format("YYYY-MM-DD");
    const params = { userId: user.id, start: sdt, end: edt };
    PayService.getAllByDate(params)
      .then((res) => {
        setPays(res.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Widget style={{ height: "400px" }}>
        <h3>
          <span className="fw-semi-bold">Daily</span>
          <div className="float-right">
            <Button color="default" className="mr-2" size="sm" onClick={() => handlePayAddModalClick(true)}>
              Add
            </Button>
          </div>
        </h3>
        <FormGroup className={s.dateWrapper}>
          <div>
            <DatePicker
              locale="en"
              format="yyyy-MM-dd"
              dayPlaceholder="dd"
              monthPlaceholder="MM"
              yearPlaceholder="yyyy"
              className={s.datePicker}
              clearIcon={null}
              onChange={(d) => setStartDate(d)}
              value={startDate ? new Date(startDate) : null}
            />
          </div>
          &nbsp;&nbsp;&nbsp;
          <div>
            <DatePicker
              locale="en"
              format="yyyy-MM-dd"
              dayPlaceholder="dd"
              monthPlaceholder="MM"
              yearPlaceholder="yyyy"
              className={s.datePicker}
              clearIcon={null}
              onChange={(d) => setEndDate(d)}
              value={endDate ? new Date(endDate) : null}
            />
          </div>
          &nbsp;&nbsp;
          <Button color="inverse" className="mr-2" size="xs" onClick={onPaySearchClick}>
            <i className="fa fa-search" />
          </Button>
        </FormGroup>
        <br />
        <div className={s.overFlow}>
          <Table className="table-hover">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Assert</th>
                <th>Cat</th>
                <th>Description</th>
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
                      {pay.description && pay.description.length > 15 ? (
                        <td title={pay.description}>{pay.description.substr(0, 15) + "..."}</td>
                      ) : (
                        <td>{pay.description ? pay.description : "-"}</td>
                      )}
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
