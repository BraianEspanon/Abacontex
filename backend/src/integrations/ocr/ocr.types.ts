export interface ExtraccionDocumentoResult {
  enunciadoTexto: string;
}

export interface IOcrProvider {
  extraerTexto(buffer: Buffer, mimetype: string): Promise<ExtraccionDocumentoResult>;
}
