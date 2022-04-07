import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Button, FormGroup, InputGroup, Input, Label } from "reactstrap";
import JSONPretty from "react-json-pretty";
import XMLViewer from "react-xml-viewer";
import SyntaxHighlighter from "react-syntax-highlighter";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { MdArrowForwardIos } from "react-icons/md";

import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Widget from "../../components/Widget";

import s from "./Formatter.module.scss";
import "react-json-pretty/themes/monikai.css";
import "react-notifications/lib/notifications.css";
import "./Formatter.css";

const JSONPrettyMon = require("react-json-pretty/dist/monikai");
const beautify_js = require("js-beautify").js;
const beautify_html = require("js-beautify").html;
const beautify_css = require("js-beautify").css;
const minify = require("string-minify");

const customXMLTheme = {
  attributeKeyColor: "#954121",
  attributeValueColor: "#40a070",
  tagColor: "#0086b3",
  separatorColor: "rgba(244, 244, 245, 0.6)",
  textColor: "rgba(244, 244, 245, 0.6)",
};

export default function Formatter() {
  const [originalInput, setOriginalInput] = useState("");
  const [output, setOutput] = useState("");
  const [type, setType] = useState(null);
  const outputRef = useRef(null);
  const [isCopyBtnDisabled, setIsCopyBtnDisabled] = useState(false);

  useEffect(() => {}, []);

  // original input 값 변경 시 originalInput state 업데이트
  const handleInputChange = (e) => {
    const value = e.target.value;
    setOriginalInput(value);
  };

  // input의 내용을 type 별로 prettier
  const doJSONFormat = () => {
    setType("JSON");
    setOutput(originalInput);
  };
  const doXMLFormat = () => {
    setType("XML");
    setOutput(originalInput);
  };
  const doJSFormat = () => {
    setType("JS");
    const data = beautify_js(originalInput, { indent_size: 2, space_in_empty_paren: true });
    setOutput(data);
  };
  const doHTMLFormat = () => {
    setType("HTML");
    const data = beautify_html(originalInput, { indent_size: 2, space_in_empty_paren: true });
    setOutput(data);
  };
  const doCSSFormat = () => {
    setType("CSS");
    const data = beautify_css(originalInput, { indent_size: 2, space_in_empty_paren: true });
    setOutput(data);
  };
  const doMinify = () => {
    setType("MINIFY");
    const data = minify(originalInput);
    setOutput(data);
  };

  // copy button click
  const copyToclipboard = () => {
    window.getSelection().selectAllChildren(outputRef.current);
    navigator.clipboard.writeText(window.getSelection().toString()).then(
      () => {
        setIsCopyBtnDisabled(true);
        setTimeout(() => {
          setIsCopyBtnDisabled(false);
        }, 2000);
        NotificationManager.success("Copied", null, 2000);
      },
      (e) => {
        console.log(e);
      }
    );
  };

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Util - <span className="fw-semi-bold">Formatter</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Formatter</span>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>pretty formatter</code> for JSON, XML, etc.
            </p>
            <NotificationContainer />
            <Row>
              <Col lg={5} md={5} sm={12}>
                <FormGroup>
                  <Label for="original">Before</Label>
                  <InputGroup className="input-group-no-border">
                    <Input
                      id="original"
                      className="input-transparent pl-3"
                      value={originalInput}
                      onChange={handleInputChange}
                      rows={25}
                      type="textarea"
                      required
                      name="original"
                      placeholder="Original input"
                      style={{ border: "1px solid", padding: "10px", resize: "none" }}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={1} md={1} sm={12}>
                <div className={s.btnWrapper}>
                  <Button color="default" className="mr-2" size="sm" onClick={doJSONFormat}>
                    <Row className={s.buttonRow}>
                      <Col lg={9} md={9} sm={9}>
                        JSON
                        <br />
                        Beautify
                      </Col>
                      <Col lg={3} md={3} sm={3} className={s.buttonIcon}>
                        <MdArrowForwardIos />
                      </Col>
                    </Row>
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doXMLFormat}>
                    <Row className={s.buttonRow}>
                      <Col lg={9} md={9} sm={9}>
                        XML
                        <br />
                        Beautify
                      </Col>
                      <Col lg={3} md={3} sm={3} className={s.buttonIcon}>
                        <MdArrowForwardIos />
                      </Col>
                    </Row>
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doJSFormat}>
                    <Row className={s.buttonRow}>
                      <Col lg={9} md={9} sm={9}>
                        JS
                        <br />
                        Beautify
                      </Col>
                      <Col lg={3} md={3} sm={3} className={s.buttonIcon}>
                        <MdArrowForwardIos />
                      </Col>
                    </Row>
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doHTMLFormat}>
                    <Row className={s.buttonRow}>
                      <Col lg={9} md={9} sm={9}>
                        HTML
                        <br />
                        Beautify
                      </Col>
                      <Col lg={3} md={3} sm={3} className={s.buttonIcon}>
                        <MdArrowForwardIos />
                      </Col>
                    </Row>
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doCSSFormat}>
                    <Row className={s.buttonRow}>
                      <Col lg={9} md={9} sm={9}>
                        CSS
                        <br />
                        Beautify
                      </Col>
                      <Col lg={3} md={3} sm={3} className={s.buttonIcon}>
                        <MdArrowForwardIos />
                      </Col>
                    </Row>
                  </Button>
                  <Button color="inverse" className="mr-2" size="sm" onClick={doMinify}>
                    <Row className={s.buttonRow}>
                      <Col lg={9} md={9} sm={9}>
                        Minify
                      </Col>
                      <Col lg={3} md={3} sm={3} className={s.buttonIcon}>
                        <MdArrowForwardIos />
                      </Col>
                    </Row>
                  </Button>
                </div>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <FormGroup>
                  <Label for="original">Output</Label>
                  <Button
                    color="inverse"
                    className="mr-2"
                    size="xs"
                    onClick={copyToclipboard}
                    style={{ float: "right", cursor: isCopyBtnDisabled ? "not-allowed" : "" }}
                    disabled={isCopyBtnDisabled}
                  >
                    {isCopyBtnDisabled ? "Wait.." : "Copy"}
                  </Button>
                  <div ref={outputRef} className={s.outputWrapper}>
                    {type === "JSON" ? (
                      <JSONPretty
                        data={output}
                        theme={JSONPrettyMon}
                        onJSONPrettyError={(e) => {
                          console.log(e);
                        }}
                        space="2"
                        style={{ whiteSpace: "pre" }}
                      ></JSONPretty>
                    ) : null}
                    {type === "XML" ? (
                      <pre style={{ background: "transparent", border: "none" }}>
                        <XMLViewer xml={output} theme={customXMLTheme} />
                      </pre>
                    ) : null}
                    {type === "JS" ? (
                      <SyntaxHighlighter className={s.codezone} language="javascript" style={docco}>
                        {output}
                      </SyntaxHighlighter>
                    ) : null}
                    {type === "HTML" ? (
                      <SyntaxHighlighter className={s.codezone} language="html" style={docco}>
                        {output}
                      </SyntaxHighlighter>
                    ) : null}
                    {type === "CSS" ? (
                      <SyntaxHighlighter className={s.codezone} language="css" style={docco}>
                        {output}
                      </SyntaxHighlighter>
                    ) : null}
                    {type === "MINIFY" ? (
                      <div>
                        <pre className={s.codezone} style={{ color: "rgba(244, 244, 245, 0.6)" }}>
                          {output}
                        </pre>
                      </div>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
