import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

export class ReferenceNode extends ClassicPreset.Node {
  constructor() {
    super('reference')

    this.addOutput('output', new ClassicPreset.Output(socket, 'Continue to Next Step'))
  }
}

export class Node extends ClassicPreset.Node {
  constructor({
    label,
    hasInput = false,
    hasOutput = false,
  }: {
    label: string
    hasInput?: boolean
    hasOutput?: boolean
  }) {
    super(label)

    if (hasInput) {
      this.addInput('input', new ClassicPreset.Input(socket, 'label?', true))
    }
    if (hasOutput) {
      this.addOutput('output', new ClassicPreset.Output(socket))
    }
  }
}
