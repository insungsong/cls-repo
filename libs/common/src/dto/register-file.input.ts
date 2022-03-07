export class RegisterFileInput {
  id!: string;
  s3Uri!: string;
  fileName!: string;
  fileExtension?: string | null;
  fileMimetype?: string | null;
  filePath!: string;
  description?: string | null;
  size!: number;
  /** @deprecated Legacy */
  oldFileId?: string | null;
}
