export async function handleCopy(input: any) {
  await navigator.clipboard.writeText(JSON.stringify(input))
}
