import React from 'react'

const Metric = (props) =>
  <div className="metric">
    <div>
      <style jsx>{`
        display: flex;
        justify-content: center;
        flex-direction: column;
      `} </style>
      <h1>{props.metric}</h1>
      <div>{props.label}</div>
    </div>
  </div>

export default Metric;
