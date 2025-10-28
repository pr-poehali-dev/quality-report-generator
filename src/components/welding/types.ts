export interface WeldConnection {
  id: string;
  number: string;
  diameter: string;
  section: string;
  sensitivity: string;
  coordinates: string;
  defects: string;
  conclusion: 'годен' | 'ремонт' | 'вырезать';
  notes: string;
}

export interface FormData {
  labName: string;
  certificate: string;
  normDoc: string;
  otkNumber: string;
  radiationSource: string;
  detector: string;
  protectiveScreen: string;
  amplifier: string;
  vikNumber: string;
  vikDate: string;
  conclusionNumber: string;
  conclusionDate: string;
  objectName: string;
  qualityLevel: string;
  controlVolume: string;
  routeName: string;
  pipelineSection: string;
  contractor: string;
  customer: string;
  welderMark: string;
  controllerName: string;
  controllerLevel: string;
  controllerCertificate: string;
  controlDate: string;
}
