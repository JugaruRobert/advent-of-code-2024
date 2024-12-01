export function getGroups(input: string): string[] {
  return input.includes('\r') ? input.split('\r\n\r\n') : input.split('\n\n');
}
