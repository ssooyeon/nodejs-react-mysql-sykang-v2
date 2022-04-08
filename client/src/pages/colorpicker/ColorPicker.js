import React, { useEffect, useState } from "react";
import { Row, Col, FormGroup, Label } from "reactstrap";
import { SketchPicker, PhotoshopPicker, BlockPicker, HuePicker, AlphaPicker, CirclePicker, SliderPicker, SwatchesPicker } from "react-color";

import Widget from "../../components/Widget";

import s from "./ColorPicker.module.scss";
import "./ColorPicker.css";

const complementaryColors = require("complementary-colors");

export default function ColorPicker() {
  const [color, setColor] = useState("#263238"); // r:38, g:50, b:56
  const [complementaryColor, setComplementaryColor] = useState([]); // 보색(2)
  const [triadicColor, setTriadicColor] = useState([]); // 삼색(3)
  const [squareColor, setSquareColor] = useState([]); // 사각형색(4)
  const [analogousColor, setAnalogousColor] = useState([]); // 유사색(3)
  const [splitComplementaryColor, setSplitComplementaryColor] = useState([]); // 분할보색(3)
  const [rectangleColor, setRectangleColor] = useState([]); // 직사각형색(4)

  useEffect(() => {
    const c = new complementaryColors(color);
    doSetComplementaryColor(c);
    doSetTriadicColor(c);
    doSetSquareColor(c);
    doSetAnalogousColor(c);
    doSetSplitComplementaryColor(c);
    doSetRectangleColor(c);
  }, [color]);

  const doSetComplementaryColor = (originColor) => {
    const complementary = originColor.complementary();
    let array = [];
    complementary.forEach((rgb) => {
      const hex = rgbToHex(rgb);
      array.push(hex);
    });
    setComplementaryColor(array);
  };

  const doSetTriadicColor = (originColor) => {
    const triad = originColor.triad();
    let array = [];
    triad.forEach((rgb) => {
      const hex = rgbToHex(rgb);
      array.push(hex);
    });
    setTriadicColor(array);
  };

  const doSetSquareColor = (originColor) => {
    const square = originColor.square();
    let array = [];
    square.forEach((rgb) => {
      const hex = rgbToHex(rgb);
      array.push(hex);
    });
    setSquareColor(array);
  };

  const doSetAnalogousColor = (originColor) => {
    const analogous = originColor.analogous();
    let array = [];
    analogous.forEach((rgb) => {
      const hex = rgbToHex(rgb);
      array.push(hex);
    });
    setAnalogousColor(array);
  };

  const doSetSplitComplementaryColor = (originColor) => {
    const splitComplementary = originColor.splitComplementary();
    let array = [];
    splitComplementary.forEach((rgb) => {
      const hex = rgbToHex(rgb);
      array.push(hex);
    });
    setSplitComplementaryColor(array);
  };

  const doSetRectangleColor = (originColor) => {
    const tetradic = originColor.tetradic();
    let array = [];
    tetradic.forEach((rgb) => {
      const hex = rgbToHex(rgb);
      array.push(hex);
    });
    setRectangleColor(array);
  };

  // rgb를 hex code로 변환
  const rgbToHex = (rgb) => {
    const r = rgb.r.toString(16);
    const g = rgb.g.toString(16);
    const b = rgb.b.toString(16);
    const rResult = r.length === 1 ? "0" + r : r;
    const gResult = g.length === 1 ? "0" + g : g;
    const bResult = b.length === 1 ? "0" + b : b;
    return `#${rResult}${gResult}${bResult}`;
  };

  // 보색 등의 text 클릭 시 전체 선택
  const selectColorText = (e) => {
    e.target.select();
  };

  return (
    <div className={s.root}>
      <h2 className="page-title">
        Util - <span className="fw-semi-bold">Color Picker</span>
      </h2>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Widget>
            <h3>
              <span className="fw-semi-bold">Color Picker</span>
            </h3>
            <p>
              {"Indicates a list of "}
              <code>color picker</code> with palette.
            </p>
            <Row>
              <Col lg={3} md={3} sm={12}>
                <FormGroup>
                  <Label>Swatches</Label>
                  <SwatchesPicker height="100%" color={color} onChangeComplete={(color) => setColor(color.hex)} />
                </FormGroup>
              </Col>
              <Col lg={2} md={2} sm={12}>
                <FormGroup>
                  <Label>Sketch</Label>
                  <SketchPicker color={color} width={200} onChangeComplete={(color) => setColor(color.hex)} />
                  <br />
                  <Label>Circle</Label>
                  <CirclePicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                </FormGroup>
              </Col>
              <Col lg={4} md={4} sm={12}>
                <FormGroup>
                  <Label>Photoshop</Label>
                  <PhotoshopPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                  <br />
                  <Label>Silder</Label>
                  <SliderPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                </FormGroup>
              </Col>
              <Col lg={2} md={2} sm={12}>
                <FormGroup>
                  <Label>Block</Label>
                  <BlockPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                  <br />
                  <Label>Hue</Label>
                  <HuePicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                  <br />
                  <Label>Alpha</Label>
                  <AlphaPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <FormGroup>
                <Label>Complementary</Label>
                <div className={s.colorDivWrapper}>
                  {complementaryColor.length > 0
                    ? complementaryColor.map((hex, key) => {
                        return (
                          <div key={key}>
                            <div className={s.colorDiv} style={{ background: hex }}></div>
                            <textarea className={s.colorText} value={hex} onClick={selectColorText} readOnly />
                          </div>
                        );
                      })
                    : null}
                </div>
              </FormGroup>
              <div className={s.nbsp}></div>
              <FormGroup>
                <Label>Triadic</Label>
                <div className={s.colorDivWrapper}>
                  {triadicColor.length > 0
                    ? triadicColor.map((hex, key) => {
                        return (
                          <div key={key}>
                            <div className={s.colorDiv} style={{ background: hex }}></div>
                            <textarea className={s.colorText} value={hex} onClick={selectColorText} readOnly />
                          </div>
                        );
                      })
                    : null}
                </div>
              </FormGroup>
              <div className={s.nbsp}></div>
              <FormGroup>
                <Label>Square</Label>
                <div className={s.colorDivWrapper}>
                  {squareColor.length > 0
                    ? squareColor.map((hex, key) => {
                        return (
                          <div key={key}>
                            <div className={s.colorDiv} style={{ background: hex }}></div>
                            <textarea className={s.colorText} value={hex} onClick={selectColorText} readOnly />
                          </div>
                        );
                      })
                    : null}
                </div>
              </FormGroup>
              <div className={s.nbsp}></div>
              <FormGroup>
                <Label>Analogous</Label>
                <div className={s.colorDivWrapper}>
                  {analogousColor.length > 0
                    ? analogousColor.map((hex, key) => {
                        return (
                          <div key={key}>
                            <div className={s.colorDiv} style={{ background: hex }}></div>
                            <textarea className={s.colorText} value={hex} onClick={selectColorText} readOnly />
                          </div>
                        );
                      })
                    : null}
                </div>
              </FormGroup>
              <div className={s.nbsp}></div>
              <FormGroup>
                <Label>Splilt Complementary</Label>
                <div className={s.colorDivWrapper}>
                  {splitComplementaryColor.length > 0
                    ? splitComplementaryColor.map((hex, key) => {
                        return (
                          <div key={key}>
                            <div className={s.colorDiv} style={{ background: hex }}></div>
                            <textarea className={s.colorText} value={hex} onClick={selectColorText} readOnly />
                          </div>
                        );
                      })
                    : null}
                </div>
              </FormGroup>
              <div className={s.nbsp}></div>
              <FormGroup>
                <Label>Rectangle (Tetradic)</Label>
                <div className={s.colorDivWrapper}>
                  {rectangleColor.length > 0
                    ? rectangleColor.map((hex, key) => {
                        return (
                          <div key={key}>
                            <div className={s.colorDiv} style={{ background: hex }}></div>
                            <textarea className={s.colorText} value={hex} onClick={selectColorText} readOnly />
                          </div>
                        );
                      })
                    : null}
                </div>
              </FormGroup>
            </Row>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}
