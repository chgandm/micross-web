export interface PuzzleMetaData {
  $key: string;
  order: number;
  title: MultiLangeAttribute;
  author: string;
  size: string;
}

export interface MultiLangeAttribute {
  en: string;
}
