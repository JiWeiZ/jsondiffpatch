export interface Block {
  id: string,
  type: string,
  name: string,
  data?: object,
  nodes: Block[] | Text[]
}

export interface Text {
  id: string,
  type: string,
  leaves: Leaf[]
}

export interface Leaf {
  id: string,
  text: string,
  marks: Mark[]
}

export interface Mark {
  type: string,
  value?: string
}
