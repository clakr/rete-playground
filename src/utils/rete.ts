import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

export class Node extends ClassicPreset.Node {
  constructor(uuid: string) {
    super(uuid)

    this.addInput('input', new ClassicPreset.Input(socket))
    this.addOutput('output', new ClassicPreset.Output(socket))
  }
}
