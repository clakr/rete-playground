import { Input, Output, Socket } from 'rete/_types/presets/classic'

export async function handleCopy(input: any) {
  await navigator.clipboard.writeText(JSON.stringify(input))
}

export function sortByIndex(
  entries: Array<[string, Output<Socket> | undefined]> | Array<[string, Input<Socket> | undefined]>,
) {
  if (!entries) throw new Error('no entries')

  return [...entries].sort((a, b) => {
    const ai = (a[1] && a[1].index) || 0
    const bi = (b[1] && b[1].index) || 0

    return ai - bi
  })
}
