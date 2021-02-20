import { Response } from 'node-fetch'

export const res64 = async (res: Response): Promise<string> => {
  return Buffer.from(await res.arrayBuffer()).toString('base64')
}
