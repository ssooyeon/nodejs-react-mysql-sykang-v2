import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Button } from "reactstrap";

import Widget from "../../components/Widget";
import s from "./UserGroup.module.scss";

import { retrieveUsers, deleteUser } from "../../actions/users";

export default function Static() {
  const users = useSelector((state) => state.users || []);
  const dispatch = useDispatch();

  const [searchUserInput, setSearchUserInput] = useState(null);
  const [searchGroupInput, setSearchGroupInput] = useState(null);

  const [userAddModalOpen, setUserAddModalOpen] = useState(false);
  const [userEditModalOpen, setUserEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState([]);

  const [groupAddModalOpen, setGroupAddModalOpen] = useState(false);
  const [groupEditModalOpen, setGroupEditModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState([]);

  useEffect(() => {
    dispatch(retrieveUsers());
  }, [dispatch]);

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Tables - <span className="fw-semi-bold">Users & Groups</span>
      </h2>
      <Row>
        <Col lg={6} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Users</span>
              <div className="float-right">
                <Button color="default" className="mr-2" size="sm">
                  Add
                </Button>
              </div>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>users</code> in the system.
            </p>
            <div className={s.overFlow}>
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Account</th>
                    <th>Email</th>
                    <th>Group</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody>
                  {users.map((user, key) => {
                    return (
                      <tr key={key}>
                        <td>{user.id}</td>
                        <td>{user.account}</td>
                        <td>
                          <a href="#">{user.email}</a>
                        </td>
                        <td>{user.groupId}</td>
                        <td>{user.createdAt}</td>
                        <td>
                          <Button color="default" className="mr-2" size="xs">
                            E
                          </Button>
                          <Button color="inverse" className="mr-2" size="xs">
                            D
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* eslint-enable */}
              </Table>
            </div>
          </Widget>
        </Col>
        <Col lg={6} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Groups</span>
              <div className="float-right">
                <Button color="default" className="mr-2" size="sm">
                  Add
                </Button>
              </div>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>groups</code> in the system.
            </p>
            <div className={s.overFlow}>
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* eslint-disable */}
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>administrators</td>
                    <td>2021-07-01T04:53:48.000Z</td>
                    <td>
                      <Button color="default" className="mr-2" size="xs">
                        E
                      </Button>
                      <Button color="inverse" className="mr-2" size="xs">
                        D
                      </Button>
                    </td>
                  </tr>
                </tbody>
                {/* eslint-enable */}
              </Table>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
