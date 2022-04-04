import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, FormGroup, InputGroup, Input, Label } from "reactstrap";
import JSONPretty from "react-json-pretty";
import XMLViewer from "react-xml-viewer";

import Widget from "../../components/Widget";
import s from "./Formatter.module.scss";

import "react-json-pretty/themes/monikai.css";
import "./Formatter.css";

const JSONPrettyMon = require("react-json-pretty/dist/monikai");
const HTMLPretty = require("html-prettify");

const customXMLTheme = {
  attributeKeyColor: "#0074D9",
  attributeValueColor: "#2ECC40",
  separatorColor: "#cfcfcf",
  textColor: "#cfcfcf",
};

const customMinifyOptions = {
  html: {
    removeAttributeQuotes: false,
    removeOptionalTags: false,
  },
};

export default function Formatter() {
  const [originalInput, setOriginalInput] = useState("");
  const [output, setOutput] = useState("");
  const [type, setType] = useState(null);

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
  const doJSFormat = () => {};
  const doHTMLFormat = () => {};
  const doMinify = () => {
    setType("MINIFY");
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
                      style={{ border: "1px solid", padding: "10px" }}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={1} md={1} sm={12}>
                <div className={s.btnWrapper}>
                  <Button color="default" className="mr-2" size="sm" onClick={doJSONFormat}>
                    JSON Formatter
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doXMLFormat}>
                    XML Formatter
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doJSFormat}>
                    JS Formatter
                  </Button>
                  <Button color="default" className="mr-2" size="sm" onClick={doHTMLFormat}>
                    HTML Formatter
                  </Button>
                  <Button color="inverse" className="mr-2" size="sm" onClick={doMinify}>
                    Minify
                  </Button>
                </div>
              </Col>
              <Col lg={6} md={6} sm={12}>
                <FormGroup>
                  <Label for="original">Output</Label>
                  <div style={{ height: "550px", overflowY: "auto", border: "1px solid", padding: "10px" }}>
                    {type === "JSON" ? (
                      <JSONPretty
                        data={output}
                        theme={JSONPrettyMon}
                        onJSONPrettyError={(e) => {
                          console.log(e);
                        }}
                        space="4"
                      ></JSONPretty>
                    ) : null}
                    {type === "XML" ? <XMLViewer xml={output} theme={customXMLTheme} /> : null}
                    {type === "JS" ? <></> : null}
                    {type === "HTML" ? <></> : null}
                    {type === "MINIFY" ? <></> : null}
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
