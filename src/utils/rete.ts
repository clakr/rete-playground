import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

export class Node extends ClassicPreset.Node {
  constructor({ hasInput = true, hasOutput = true }: { hasInput?: boolean; hasOutput?: boolean }) {
    super(crypto.randomUUID())

    if (hasInput) {
      this.addInput('input', new ClassicPreset.Input(socket))
    }
    if (hasOutput) {
      this.addOutput('output', new ClassicPreset.Output(socket))
    }
  }
}
