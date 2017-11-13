import React from 'react'
import { Statistic, Segment } from 'semantic-ui-react'

const Metric = ({metric, label}) => (
  <Segment size='huge' padded textAlign='center'>
    <Statistic size='huge' color='grey'>
      <Statistic.Value content={metric} text />
      <Statistic.Label content={label} />
    </Statistic>
  </Segment>
)

export default Metric;
