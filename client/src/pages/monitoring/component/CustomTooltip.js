import React from "react";

function CustomTooltip(props) {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ fontSize: "13px" }}>
        <p className="label">
          date: {label} <br />
          value: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
}

export default CustomTooltip;
