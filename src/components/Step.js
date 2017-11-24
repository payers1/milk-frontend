import React from 'react'
import { Step } from 'semantic-ui-react'
import {stages} from '../stages';

const Stepper = (props) => {
  const activeStage = props.stage;
  const steps = stages.map((s) => {
    return {
      key: s.key,
      title: s.title,
      description: s.description,
      active: s.index === activeStage.index,
      completed: s.index < activeStage.index,
      disabled: s.index > activeStage.index
    }
  })
  return <Step.Group widths={5} items={steps} />
}

export default Stepper;
