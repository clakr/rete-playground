import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

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
      this.addInput('input_foo', new ClassicPreset.Input(socket))
      this.addInput('input_bar', new ClassicPreset.Input(socket))
    }
    if (hasOutput) {
      this.addOutput('output_foo', new ClassicPreset.Output(socket))
      this.addOutput('output_bar', new ClassicPreset.Output(socket))
    }
  }
}
