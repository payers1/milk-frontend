import React from 'react'
import { Grid } from 'semantic-ui-react'

const withColumn = (Component, width) => (props) => {
  return <Grid.Column width={width} > <Component {...props} /> </Grid.Column>
}

export default withColumn
