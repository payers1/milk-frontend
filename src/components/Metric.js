import React from 'react'
import { Statistic, Segment } from 'semantic-ui-react'

const Metric = ({metric, label}) => (
  <Segment size='huge' padded textAlign='center'>
    <Statistic text label={label} value={metric} size='large' color='grey' />
  </Segment>
)

export default Metric;
