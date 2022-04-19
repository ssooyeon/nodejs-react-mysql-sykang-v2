import React from "react";
import { Container, Button } from "reactstrap";
import { Link } from "react-router-dom";

import s from "./ErrorPage.module.scss";

class ErrorPage extends React.Component {
  render() {
    return (
      <div className={s.errorPage}>
        <Container>
          <div className={`${s.errorContainer} mx-auto`}>
            <h1 className={s.errorCode}>404</h1>
            <p className={s.errorInfo}>Opps, it seems that this page does not exist here.</p>
            <br />
            <Link to="/">
              <Button className={s.errorBtn} type="submit" color="inverse">
                Go to Main
              </Button>
            </Link>
          </div>
          <footer className={s.pageFooter}>
            React project made by <a href="/">sykang</a>, refer: <a href="https://flatlogic.com">Flatlogic</a>
          </footer>
        </Container>
      </div>
    );
  }
}

export default ErrorPage;
