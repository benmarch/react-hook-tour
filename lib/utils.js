import { StepConfigType } from './constants'

export const getStepConfigType = stepConfig => {
  if (!stepConfig) {
    return StepConfigType.INVALID
  }

  if (typeof stepConfig === 'string') {
    return StepConfigType.NAME
  }

  if (stepConfig.fetch) {
    return StepConfigType.ASYNC
  }

  if (stepConfig.ref) {
    return StepConfigType.FULL
  }

  if (stepConfig.name) {
    return StepConfigType.PREDEFINED
  }

  return StepConfigType.INVALID
}
