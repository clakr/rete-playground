import { ClassicPreset } from 'rete'

const socket = new ClassicPreset.Socket('socket')

export class ReferenceNode extends ClassicPreset.Node {
  constructor() {
    super('reference')

    this.addOutput('output', new ClassicPreset.Output(socket, 'Continue to Next Step'))
  }
}

export class TextNode extends ClassicPreset.Node {
  constructor() {
    super('text')

    this.addInput('input', new ClassicPreset.Input(socket, 'From Step / Triggers'))
    this.addOutput('output', new ClassicPreset.Output(socket, 'Continue to Next Step'))
    this.addControl(
      'control',
      new TextareaControl('edit me plz', (event) => {
        const textarea = this.controls['control']
        if (textarea && textarea instanceof TextareaControl) {
          const { value } = event.target as HTMLTextAreaElement
          textarea.value = value
        }
      }),
    )
  }
}

export class TextareaControl extends ClassicPreset.Control {
  constructor(
    public value: string,
    public onChange: (event: Event) => void,
  ) {
    super()
  }
}
