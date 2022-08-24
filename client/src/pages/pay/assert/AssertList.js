import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "reactstrap";
import Swal from "sweetalert2";

import Widget from "../../../components/Widget";
import s from "./AssertList.module.scss";

import { retrieveAsserts, updateAssert, deleteAssert } from "../../../actions/payasserts";

import AddAssertModal from "./AddAssertModal";
import EditAssertModal from "./EditAssertModal";

export default function AssertList({ user, someUpdate }) {
  const asserts = useSelector((state) => state.asserts || []);

  const dispatch = useDispatch();

  const [assertLastOrderNum, setAssertLastOrderNum] = useState(0);
  const [assertAddModalOpen, setAssertAddModalOpen] = useState(false);
  const [assertEditModalOpen, setAssertEditModalOpen] = useState(false);
  const [editAssert, setEditAssert] = useState([]);

  useEffect(() => {
    dispatch(retrieveAsserts({ userId: user.id })).then((res) => {
      if (res.length > 0) {
        const num = res[res.length - 1].ordering;
        setAssertLastOrderNum(num);
      }
    });
  }, [user, dispatch]);

  // assert 등록 버튼 클릭 및 AddAssertModal.js에서 닫기 버튼 클릭
  const handleAssertAddModalClick = (value, isDone) => {
    setAssertAddModalOpen(value);
    if (isDone) {
      dispatch(retrieveAsserts({ userId: user.id })).then((res) => {
        if (res.length > 0) {
          const num = res[res.length - 1].ordering;
          setAssertLastOrderNum(num);
        }
      });
      someUpdate();
    }
  };

  // assert 수정 버튼 클릭 및 EditAssertModal.js 닫기 버튼 클릭
  const handleAssertEditModalClick = (value, isDone) => {
    setAssertEditModalOpen(value);
    if (isDone) {
      someUpdate();
    }
  };

  // assert 테이블의 Edit 버튼 클릭
  const onAssertEditClick = (row) => {
    setAssertEditModalOpen(true);
    setEditAssert(row);
  };

  // assert 테이블의 Delete 버튼 클릭
  const onAssertDeleteClick = (assertId) => {
    Swal.fire({
      text: "Are you sure delete this assert?",
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
        dispatch(deleteAssert(assertId))
          .then(() => {
            someUpdate();
          })
          .catch((e) => console.log(e));
      }
    });
  };

  // assert up ordering
  const handleAssertOrderUp = (assert) => {
    const upData = { id: assert.id, ordering: assert.ordering - 1 };
    dispatch(updateAssert(upData.id, upData))
      .then(() => {
        const idx = asserts.indexOf(assert);
        const prev = asserts[idx - 1];
        const downData = { id: prev.id, ordering: prev.ordering + 1 };
        dispatch(updateAssert(downData.id, downData)).then(() => {
          dispatch(retrieveAsserts({ userId: user.id }));
        });
      })
      .catch((e) => console.log(e));
  };

  // assert down ordering
  const handleAssertOrderDown = (assert) => {
    const downData = { id: assert.id, ordering: assert.ordering + 1 };
    dispatch(updateAssert(downData.id, downData))
      .then(() => {
        const idx = asserts.indexOf(assert);
        const next = asserts[idx + 1];
        const upData = { id: next.id, ordering: next.ordering - 1 };
        dispatch(updateAssert(upData.id, upData)).then(() => {
          dispatch(retrieveAsserts({ userId: user.id }));
        });
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Widget
        style={{ minHeight: "200px" }}
        title={
          <h6>
            Assert
            <div className="float-right">
              <Button color="default" className="mr-2" size="xs" onClick={() => handleAssertAddModalClick(true)}>
                Add
              </Button>
            </div>
          </h6>
        }
      >
        <div className={s.overFlow}>
          <Table className="table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
                <th>Order</th>
              </tr>
            </thead>
            {/* eslint-disable */}
            <tbody style={{ minWidth: "" }}>
              {asserts &&
                asserts.map((assert, idx, row) => {
                  return (
                    <tr key={assert.id}>
                      <td>{assert.name}</td>
                      <td>
                        <Button color="default" className="mr-2" size="xs" onClick={(e) => onAssertEditClick(assert)}>
                          E
                        </Button>
                        <Button color="inverse" className="mr-2" size="xs" onClick={(e) => onAssertDeleteClick(assert.id)}>
                          D
                        </Button>
                      </td>
                      <td>
                        <>
                          {idx > 0 ? (
                            <Button color="" className={s.transparentButton} size="xs" onClick={() => handleAssertOrderUp(assert)}>
                              <i className="fa fa-angle-up"></i>
                            </Button>
                          ) : null}
                          {idx + 1 === row.length ? null : (
                            <Button color="" className={s.transparentButton} size="xs" onClick={() => handleAssertOrderDown(assert)}>
                              <i className="fa fa-angle-down"></i>
                            </Button>
                          )}
                        </>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </Widget>

      <AddAssertModal open={assertAddModalOpen} handleCloseClick={handleAssertAddModalClick} assertLastOrderNum={assertLastOrderNum} />
      <EditAssertModal open={assertEditModalOpen} handleCloseClick={handleAssertEditModalClick} assert={editAssert} />
    </>
  );
}
