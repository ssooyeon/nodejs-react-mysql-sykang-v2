import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "reactstrap";
import Swal from "sweetalert2";

import Widget from "../../../components/Widget";
import s from "./CatList.module.scss";

import { retrieveCats, deleteCat } from "../../../actions/paycats";

import AddCatModal from "./modal/AddCatModal";
import EditCatModal from "./modal/EditCatModal";

export default function CatList({ user, someUpdate }) {
  const cats = useSelector((state) => state.cats || []);

  const dispatch = useDispatch();

  const [catLastOrderNum, setCatLastOrderNum] = useState(0);
  const [catAddModalOpen, setCatAddModalOpen] = useState(false);
  const [catEditModalOpen, setCatEditModalOpen] = useState(false);
  const [editCat, setEditCat] = useState([]);

  useEffect(() => {
    dispatch(retrieveCats({ userId: user.id })).then((res) => {
      if (res.length > 0) {
        const num = res[res.length - 1].ordering;
        setCatLastOrderNum(num);
      }
    });
  }, [user, dispatch]);

  // cat 등록 버튼 클릭 및 AddCatModal.js에서 닫기 버튼 클릭
  const handleCatAddModalClick = (value, isDone) => {
    setCatAddModalOpen(value);
    if (isDone) {
      someUpdate();
    }
  };

  // cat 수정 버튼 클릭 및 EditCatModal.js 닫기 버튼 클릭
  const handleCatEditModalClick = (value, isDone) => {
    setCatEditModalOpen(value);
    if (isDone) {
      someUpdate();
    }
  };

  // cat 테이블의 Edit 버튼 클릭
  const onCatEditClick = (row) => {
    setCatEditModalOpen(true);
    setEditCat(row);
  };

  // cat 테이블의 Delete 버튼 클릭
  const onCatDeleteClick = (catId) => {
    Swal.fire({
      text: "Are you sure delete this category?",
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
        dispatch(deleteCat(catId))
          .then(() => {
            someUpdate();
          })
          .catch((e) => console.log(e));
      }
    });
  };

  return (
    <>
      <Widget
        style={{ minHeight: "200px" }}
        title={
          <h6>
            Category
            <div className="float-right">
              <Button color="default" className="mr-2" size="xs" onClick={() => handleCatAddModalClick(true)}>
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
                <th>Type</th>
                <th>Name</th>
                <th>Action</th>
                <th>Order</th>
              </tr>
            </thead>
            {/* eslint-disable */}
            <tbody style={{ minWidth: "" }}>
              {cats &&
                cats.map((cat, idx, row) => {
                  return (
                    <tr key={cat.id}>
                      <td>{cat.type}</td>
                      <td>
                        {cat.name} ({cat.children ? cat.children.length : "0"})
                      </td>
                      <td>
                        <Button color="default" className="mr-2" size="xs" onClick={(e) => onCatEditClick(cat)}>
                          E
                        </Button>
                        <Button color="inverse" className="mr-2" size="xs" onClick={(e) => onCatDeleteClick(cat.id)}>
                          D
                        </Button>
                      </td>
                      <td>
                        <>
                          {idx > 0 ? (
                            <Button color="" className={s.transparentButton} size="xs" onClick={() => {}}>
                              <i className="fa fa-angle-up"></i>
                            </Button>
                          ) : null}
                          {idx + 1 === row.length ? null : (
                            <Button color="" className={s.transparentButton} size="xs" onClick={() => {}}>
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

      <AddCatModal open={catAddModalOpen} handleCloseClick={handleCatAddModalClick} catLastOrderNum={catLastOrderNum} />
      <EditCatModal open={catEditModalOpen} handleCloseClick={handleCatEditModalClick} cat={editCat} />
    </>
  );
}
